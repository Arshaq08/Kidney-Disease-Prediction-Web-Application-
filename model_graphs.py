import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, label_binarize
from sklearn.metrics import (classification_report, confusion_matrix,
                             ConfusionMatrixDisplay, accuracy_score,
                             precision_score, recall_score, f1_score,
                             roc_curve, auc)

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

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
mapping = {
    "no_disease": 0, "no disease": 0,
    "low_risk": 1, "low risk": 1,
    "moderate_risk": 2, "moderate risk": 2,
    "high_risk": 3, "high risk": 3
}

df["classification"] = df["classification"].astype(str).str.lower().str.strip().map(mapping)
df = df.dropna()

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
# 5. BEFORE SMOTE GRAPH
# =========================
plt.figure()
y.value_counts().sort_index().plot(kind='bar')
plt.title("Class Distribution Before SMOTE")
plt.xlabel("Classes")
plt.ylabel("Count")
plt.show()

# =========================
# 6. SCALING + SMOTE
# =========================
scaler = StandardScaler()
X = scaler.fit_transform(X)

smote = SMOTE(random_state=42)
X, y = smote.fit_resample(X, y)

# =========================
# 7. AFTER SMOTE GRAPH
# =========================
plt.figure()
pd.Series(y).value_counts().sort_index().plot(kind='bar')
plt.title("Class Distribution After SMOTE")
plt.xlabel("Classes")
plt.ylabel("Count")
plt.show()

# =========================
# 8. TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# =========================
# 9. MODELS
# =========================
rf = RandomForestClassifier(n_estimators=300, random_state=42)
xgb = XGBClassifier(eval_metric="mlogloss", random_state=42)
lr = LogisticRegression(max_iter=1000)

rf.fit(X_train, y_train)
xgb.fit(X_train, y_train)
lr.fit(X_train, y_train)

# =========================
# 10. PREDICTIONS
# =========================
rf_pred = rf.predict(X_test)
xgb_pred = xgb.predict(X_test)
lr_pred = lr.predict(X_test)

# =========================
# 11. CONFUSION MATRIX
# =========================
cm = confusion_matrix(y_test, rf_pred)
ConfusionMatrixDisplay(cm).plot()
plt.title("Confusion Matrix - Random Forest")
plt.show()

# =========================
# 12. METRICS
# =========================
def get_metrics(y_true, y_pred):
    return [
        accuracy_score(y_true, y_pred),
        precision_score(y_true, y_pred, average='weighted'),
        recall_score(y_true, y_pred, average='weighted'),
        f1_score(y_true, y_pred, average='weighted')
    ]

rf_scores = get_metrics(y_test, rf_pred)
xgb_scores = get_metrics(y_test, xgb_pred)
lr_scores = get_metrics(y_test, lr_pred)

# =========================
# 13. EVALUATION GRAPH
# =========================
labels = ["Accuracy", "Precision", "Recall", "F1 Score"]
x = np.arange(len(labels))

plt.figure()
plt.bar(x - 0.25, rf_scores, 0.25, label="Random Forest")
plt.bar(x, xgb_scores, 0.25, label="XGBoost")
plt.bar(x + 0.25, lr_scores, 0.25, label="Logistic Regression")

plt.xticks(x, labels)
plt.title("Model Comparison")
plt.ylim(0, 1)
plt.legend()
plt.show()

# =========================
# 14. ROC CURVE
# =========================
y_test_bin = label_binarize(y_test, classes=[0,1,2,3])
rf_prob = rf.predict_proba(X_test)

plt.figure()

for i in range(4):
    fpr, tpr, _ = roc_curve(y_test_bin[:, i], rf_prob[:, i])
    roc_auc = auc(fpr, tpr)
    plt.plot(fpr, tpr, label=f"Class {i} (AUC = {roc_auc:.2f})")

plt.plot([0,1],[0,1],'k--')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve - Random Forest")
plt.legend()
plt.show()

# =========================
# 15. FEATURE IMPORTANCE
# =========================
features = df.drop("classification", axis=1).columns
importances = rf.feature_importances_

plt.figure()
plt.barh(features, importances)
plt.title("Feature Importance - Random Forest")
plt.show()

# =========================
# 16. REPORTS
# =========================
print("\nRandom Forest Report:\n", classification_report(y_test, rf_pred))
print("\nXGBoost Report:\n", classification_report(y_test, xgb_pred))
print("\nLogistic Regression Report:\n", classification_report(y_test, lr_pred))