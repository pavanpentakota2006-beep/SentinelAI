# SentinelX AI - Analytics & ML Anomaly Detection Service

Autonomous machine learning microservice for SentinelX AI, executing an unsupervised **Isolation Forest** ensemble algorithm to identify zero-day volumetric deviations, port-scan patterns, and anomalous authentication spikes in real time.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    SentinelX AI Core (Spring Boot)   │
                      └──────────────────┬───────────────────┘
                                         │ POST /api/v1/predict
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    FastAPI ML Anomaly Service (:8000)                      │
│                                                                            │
│   ┌─────────────────────┐    ┌─────────────────────┐    ┌──────────────┐   │
│   │  Payload Validation │───▶│  Feature Extraction │───▶│  Isolation   │   │
│   │     (Pydantic)      │    │    (NumPy Matrix)   │    │    Forest    │   │
│   └─────────────────────┘    └─────────────────────┘    └──────┬───────┘   │
│                                                                │           │
│                                                                ▼           │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │ Response: Anomaly Score (0.0-1.0), Risk Tier (CRITICAL/HIGH/MED/LOW)│   │
│   └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

## Endpoints

### 1. Service Health
```http
GET /health
```
**Response**:
```json
{
  "status": "healthy",
  "service": "sentinelx-analytics-ml",
  "version": "1.2.0",
  "engine": "scikit-learn IsolationForest",
  "estimators": 100,
  "timestamp": 1718000000.0
}
```

### 2. Predict Telemetry Anomaly
```http
POST /api/v1/predict
Content-Type: application/json

{
  "bytes_in": 150000,
  "bytes_out": 95000000,
  "duration_ms": 12000,
  "failed_attempts": 12,
  "port_entropy": 4.5,
  "event_id": "c1f7b889-4a92-4f1b-9dc3-e092147391ab"
}
```

**Response**:
```json
{
  "is_anomaly": true,
  "anomaly_score": 0.9421,
  "confidence": 0.982,
  "risk_tier": "CRITICAL",
  "decision_reason": "Severe telemetry divergence & brute-force threshold breach",
  "event_id": "c1f7b889-4a92-4f1b-9dc3-e092147391ab",
  "latency_ms": 1.45
}
```

### 3. Batch Telemetry Scoring
```http
POST /api/v1/predict/batch
```

---

## Local Development

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
