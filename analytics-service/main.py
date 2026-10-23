"""
SentinelX AI - Threat Analytics & ML Anomaly Detection Service
FastAPI microservice executing Scikit-learn Isolation Forest model for real-time telemetry scoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinelx-analytics")

app = FastAPI(
    title="SentinelX AI Analytics Service",
    description="Real-time ML Anomaly Detection for Network & Endpoint Telemetry",
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize baseline Isolation Forest
# Features: [bytes_in, bytes_out, duration_ms, failed_attempts, port_entropy]
baseline_data = np.array([
    [500, 1200, 45, 0, 1],
    [800, 2400, 80, 0, 1],
    [1200, 8000, 150, 0, 1],
    [300, 400, 20, 0, 1],
    [1500, 3000, 120, 0, 1],
    [600, 1100, 50, 1, 1],
    [4000, 20000, 500, 0, 2],
    [250, 350, 15, 0, 1],
    [700, 1500, 60, 0, 1],
    [950, 1800, 95, 0, 1]
])

model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
model.fit(baseline_data)
logger.info("Baseline Isolation Forest model trained successfully.")

class TelemetryFeature(BaseModel):
    bytes_in: float = Field(..., description="Inbound payload size in bytes")
    bytes_out: float = Field(..., description="Outbound payload size in bytes")
    duration_ms: float = Field(..., description="Connection duration in milliseconds")
    failed_attempts: int = Field(default=0, description="Consecutive failed authentication attempts")
    port_entropy: float = Field(default=1.0, description="Normalized port access variation")
    event_id: Optional[str] = Field(default=None, description="Correlated event UUID")

class PredictionResponse(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    confidence: float
    risk_tier: str
    decision_reason: str
    event_id: Optional[str]
    latency_ms: float

class BatchTelemetryRequest(BaseModel):
    events: List[TelemetryFeature]

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "sentinelx-analytics-ml",
        "version": "1.2.0",
        "engine": "scikit-learn IsolationForest",
        "estimators": 100,
        "timestamp": time.time()
    }

@app.post("/api/v1/predict", response_model=PredictionResponse)
def predict_anomaly(feature: TelemetryFeature):
    start_t = time.perf_counter()
    vec = np.array([[
        feature.bytes_in,
        feature.bytes_out,
        feature.duration_ms,
        float(feature.failed_attempts),
        feature.port_entropy
    ]])

    raw_score = float(model.decision_function(vec)[0])
    prediction = int(model.predict(vec)[0])  # -1 = anomaly, 1 = normal

    # Normalize score: decision_function is negative for anomalies
    normalized_score = float(np.clip(1.0 - (raw_score + 0.5), 0.0, 1.0))
    is_anomaly = (prediction == -1) or (normalized_score > 0.65) or (feature.failed_attempts >= 5)

    if normalized_score > 0.85 or feature.failed_attempts >= 10:
        risk_tier = "CRITICAL"
        reason = "Severe telemetry divergence & brute-force threshold breach"
    elif normalized_score > 0.65:
        risk_tier = "HIGH"
        reason = "Significant statistical outlier detected by Isolation Forest"
    elif normalized_score > 0.40:
        risk_tier = "MEDIUM"
        reason = "Moderate deviation from normal traffic baseline"
    else:
        risk_tier = "LOW"
        reason = "Telemetry within normal operating bounds"

    elapsed = (time.perf_counter() - start_t) * 1000

    return PredictionResponse(
        is_anomaly=is_anomaly,
        anomaly_score=round(normalized_score, 4),
        confidence=round(0.85 + abs(raw_score) * 0.15, 4),
        risk_tier=risk_tier,
        decision_reason=reason,
        event_id=feature.event_id,
        latency_ms=round(elapsed, 2)
    )

@app.post("/api/v1/predict/batch")
def predict_batch(request: BatchTelemetryRequest):
    return [predict_anomaly(item) for item in request.events]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
