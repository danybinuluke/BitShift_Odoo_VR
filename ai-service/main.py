from fastapi import FastAPI
import joblib
import numpy as np
import uvicorn

app = FastAPI()

model = joblib.load("model.pkl")

risk_labels = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH"
}

@app.get("/")
def home():
    return {"message": "FleetFlow AI Service Running"}

@app.get("/health")
def health():
    return {"status": "OK"}
    
@app.post("/predict-driver-risk")
def predict_driver_risk(data: dict):

    safetyScore = data.get("safetyScore", 100)
    tripsCompleted = data.get("tripsCompleted", 100)
    fatigueLevel = data.get("fatigueLevel", 1)

    features = np.array([
        [safetyScore, tripsCompleted, fatigueLevel]
    ])

    prediction = model.predict(features)[0]

    return {
        "riskLevel": risk_labels[prediction]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)