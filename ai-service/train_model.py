import numpy as np
from sklearn.tree import DecisionTreeClassifier
import joblib

# Fake training data for hackathon demo
# Features: safetyScore, tripsCompleted, fatigueLevel
X = np.array([
    [95, 200, 1],
    [85, 150, 2],
    [70, 120, 3],
    [60, 80, 4],
    [50, 50, 5],
    [40, 30, 6],
])

# Labels: 0=Low risk, 1=Medium risk, 2=High risk
y = np.array([0, 0, 1, 1, 2, 2])

model = DecisionTreeClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained and saved")