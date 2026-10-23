import unittest
from sklearn.ensemble import IsolationForest
from main import (
    health, predict_anomaly, predict_batch, retrain_model, get_analytics_metrics,
    TelemetryFeature, BatchTelemetryRequest, RetrainRequest, model
)
from fastapi import HTTPException

class TestAnalyticsService(unittest.TestCase):

    def test_model_initialization(self):
        self.assertIsNotNone(model)
        self.assertEqual(model.n_estimators, 100)

    def test_health_check(self):
        data = health()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "sentinelx-analytics-ml")
        self.assertEqual(data["version"], "1.2.0")
        self.assertEqual(data["estimators"], 100)

    def test_predict_normal_telemetry(self):
        feature = TelemetryFeature(
            bytes_in=600.0,
            bytes_out=1200.0,
            duration_ms=50.0,
            failed_attempts=0,
            port_entropy=1.0,
            event_id="test-normal-01"
        )
        res = predict_anomaly(feature)
        self.assertFalse(res.is_anomaly)
        self.assertEqual(res.risk_tier, "LOW")
        self.assertLess(res.anomaly_score, 0.65)
        self.assertEqual(res.event_id, "test-normal-01")
        self.assertGreater(res.confidence, 0.5)

    def test_predict_critical_anomaly_and_brute_force(self):
        feature = TelemetryFeature(
            bytes_in=150000.0,
            bytes_out=85000000.0,
            duration_ms=12000.0,
            failed_attempts=15,
            port_entropy=4.8,
            event_id="test-exfil-02"
        )
        res = predict_anomaly(feature)
        self.assertTrue(res.is_anomaly)
        self.assertEqual(res.risk_tier, "CRITICAL")
        self.assertGreater(res.anomaly_score, 0.70)
        self.assertIn("threshold breach", res.decision_reason)

    def test_predict_batch_telemetry(self):
        batch = BatchTelemetryRequest(
            events=[
                TelemetryFeature(bytes_in=500.0, bytes_out=1000.0, duration_ms=40.0, failed_attempts=0, port_entropy=1.0, event_id="b-1"),
                TelemetryFeature(bytes_in=900000.0, bytes_out=90000000.0, duration_ms=9000.0, failed_attempts=20, port_entropy=5.0, event_id="b-2")
            ]
        )
        results = predict_batch(batch)
        self.assertEqual(len(results), 2)
        self.assertFalse(results[0].is_anomaly)
        self.assertTrue(results[1].is_anomaly)

    def test_analytics_metrics_tracking(self):
        # Trigger an inference first to test metrics accumulation
        feature = TelemetryFeature(bytes_in=500.0, bytes_out=1000.0, duration_ms=40.0, failed_attempts=0, port_entropy=1.0)
        predict_anomaly(feature)
        metrics = get_analytics_metrics()
        self.assertGreaterEqual(metrics.total_inferences, 1)
        self.assertIn("1.2.0", metrics.model_version)

    def test_model_retraining(self):
        global model
        samples = [
            TelemetryFeature(bytes_in=500.0 + i * 50, bytes_out=1000.0 + i * 100, duration_ms=30.0 + i * 5, failed_attempts=0, port_entropy=1.0)
            for i in range(12)
        ]
        retrain_req = RetrainRequest(samples=samples, contamination=0.1, n_estimators=50)
        res = retrain_model(retrain_req)
        self.assertEqual(res.status, "success")
        self.assertEqual(res.samples_ingested, 12)
        self.assertEqual(res.estimators, 50)
        self.assertGreater(res.training_duration_ms, 0)

        # Restore baseline model to avoid polluting subsequent tests
        from main import baseline_data
        baseline_model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
        baseline_model.fit(baseline_data)
        import main
        main.model = baseline_model

    def test_model_retraining_insufficient_samples(self):
        samples = [
            TelemetryFeature(bytes_in=500.0, bytes_out=1000.0, duration_ms=30.0, failed_attempts=0, port_entropy=1.0)
            for _ in range(2)
        ]
        retrain_req = RetrainRequest(samples=samples)
        with self.assertRaises(HTTPException) as ctx:
            retrain_model(retrain_req)
        self.assertEqual(ctx.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()

