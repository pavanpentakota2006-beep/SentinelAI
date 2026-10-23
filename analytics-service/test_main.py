import unittest
from main import health, predict_anomaly, predict_batch, TelemetryFeature, BatchTelemetryRequest, model

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

if __name__ == "__main__":
    unittest.main()
