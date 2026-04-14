import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier  # ✅ CHANGED
from imblearn.over_sampling import SMOTE
import joblib

# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv(r"C:\Users\arsha\OneDrive\Desktop\COLLEGE\PROJECTS\KDP\nephroAI\nephroAI\nephroai-health-companion-main\Backend\kidney_disease_dataset.csv")

# =========================
# 2. RENAME COLUMNS
# =========================
column_mapping = {
    "Age of the patient": "age",
    "Blood pressure (mm/Hg)": "bp",
    "Specific gravity of urine": "sg",
    "Albumin in urine": "al",
    "Sugar in urine": "su",
    "Red blood cells in urine": "rbc",
    "Pus cells in urine": "pc",
    "Pus cell clumps in urine": "pcc",
    "Bacteria in urine": "ba",
    "Random blood glucose level (mg/dl)": "bgr",
    "Blood urea (mg/dl)": "bu",
    "Serum creatinine (mg/dl)": "sc",
    "Sodium level (mEq/L)": "sod",
    "Potassium level (mEq/L)": "pot",
    "Hemoglobin level (gms)": "hemo",
    "Packed cell volume (%)": "pcv",
    "White blood cell count (cells/cumm)": "wc",
    "Red blood cell count (millions/cumm)": "rc",
    "Hypertension (yes/no)": "htn",
    "Diabetes mellitus (yes/no)": "dm",
    "Coronary artery disease (yes/no)": "cad",
    "Appetite (good/poor)": "appet",
    "Pedal edema (yes/no)": "pe",
    "Anemia (yes/no)": "ane",
    "Target": "classification"
}

df = df.rename(columns=column_mapping)
df = df[list(column_mapping.values())]

# =========================
# 3. TARGET PROCESSING
# =========================
df["classification"] = df["classification"].astype(str).str.strip().str.lower()

mapping = {
    "no_disease": 0, "no disease": 0,
    "low_risk": 1, "low risk": 1,
    "moderate_risk": 2, "moderate risk": 2,
    "high_risk": 3, "high risk": 3
}

df["classification"] = df["classification"].map(mapping)
df = df.dropna(subset=["classification"])
df["classification"] = df["classification"].astype(int)

# =========================
# 4. FEATURE PROCESSING
# =========================
X = df.drop("classification", axis=1)
y = df["classification"]

X = X.replace("?", np.nan)

for col in X.columns:
    X[col] = X[col].astype(str).str.lower().str.strip()

X = X.replace({
    "yes": 1, "no": 0,
    "normal": 1, "abnormal": 0,
    "present": 1, "notpresent": 0,
    "good": 1, "poor": 0
})

X = X.apply(pd.to_numeric, errors="coerce")
X = X.fillna(X.median(numeric_only=True))

# =========================
# 5. SCALING
# =========================
scaler = StandardScaler()
X = scaler.fit_transform(X)

# =========================
# 6. SMOTE
# =========================
smote = SMOTE(random_state=42)
X, y = smote.fit_resample(X, y)

# =========================
# 7. STRATIFIED SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================
# 8. RANDOM FOREST MODEL 🔥
# =========================
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# =========================
# 9. EVALUATION
# =========================
y_pred = model.predict(X_test)

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

accuracy = model.score(X_test, y_test)
print("\n🔥 Accuracy:", accuracy)

# =========================
# 10. CROSS VALIDATION
# =========================
scores = cross_val_score(model, X, y, cv=5)
print("Cross Validation Accuracy:", scores.mean())

# =========================
# 11. SAVE MODEL
# =========================
joblib.dump(model, "kidney_rf.pkl")   # ✅ changed name
joblib.dump(scaler, "scaler.pkl")
joblib.dump(X_train.mean(axis=0), "mean.pkl")

print("\n✅ RANDOM FOREST MODEL SAVED!")