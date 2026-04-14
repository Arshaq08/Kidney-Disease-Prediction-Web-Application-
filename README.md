# 🧠 Kidney Disease Prediction Web Application

An AI-powered web application designed to predict the risk level of Chronic Kidney Disease (CKD) using machine learning. The system allows users to input medical parameters manually or upload a medical report for automatic data extraction and prediction.

---

## 🚀 Features

* 🔍 **CKD Risk Prediction** (No Disease, Low, Moderate, High)
* 🌳 **High-Accuracy Model (Random Forest - 97%)**
* 📄 **Medical Report Upload & Auto Extraction**
* ⚡ **Real-time Prediction via Flask API**
* 🎯 **User-friendly Interface (React + Tailwind)**
* 🧠 **AI-based Decision Support System**

---

## 🏗️ Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Flask (Python)
* REST API

### Machine Learning

* Random Forest Classifier 🌳
* XGBoost (for comparison)
* SMOTE (Imbalanced Data Handling)
* Scikit-learn

---

## 📁 Project Structure

```id="j9mj9v"
nephroAI/
│
├── Frontend/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── Backend/
│   ├── train_model.py
│   ├── app.py
│   ├── kidney.pkl
│   └── dataset/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash id="3ccz7z"
git clone https://github.com/Arshaq08/Kidney-Disease-Prediction-Web-Application.git
cd Kidney-Disease-Prediction-Web-Application
```

---

### 2️⃣ Backend Setup

```bash id="7mqbkm"
cd Backend
pip install -r requirements.txt
python train_model.py
python app.py
```

👉 Flask server runs on:

```id="z5dwm7"
http://127.0.0.1:5000
```

---

### 3️⃣ Frontend Setup

```bash id="b2m61y"
cd Frontend
npm install
npm run dev
```

👉 App runs on:

```id="p9c1y7"
http://localhost:5173
```

---

## 📊 Machine Learning Model

* Final Model: **Random Forest Classifier 🌳**
* Accuracy Achieved: **97%**
* Other Models Tested:

  * XGBoost (~91–94%)
  * Logistic Regression (lower performance)

### 🔬 Techniques Used:

* Data Cleaning & Preprocessing
* Label Encoding
* Handling Missing Values
* SMOTE for class balancing
* Train-Test Split
* Hyperparameter Tuning

---

## 🧪 How It Works

1. User enters medical data OR uploads report
2. Data is processed in backend
3. Machine learning model predicts CKD risk
4. Result is returned via API
5. Frontend displays prediction

---

## 📌 API Endpoint

### POST `/predict`

**Request Example:**

```json id="dwcxzs"
{
  "age": 45,
  "bp": 80,
  "sg": 1.02,
  "al": 1,
  "su": 0
}
```

**Response:**

```json id="cl1whl"
{
  "prediction": "Moderate Risk"
}
```

---

## 📈 Results & Performance

| Model               | Accuracy  |
| ------------------- | --------- |
| Logistic Regression | ~80%      |
| XGBoost             | ~91–94%   |
| **Random Forest**   | **97% ✅** |

👉 Random Forest was selected as the final model due to its superior accuracy and better generalization.

---



## 🔮 Future Enhancements

* 📊 Add ROC Curve & advanced evaluation metrics
* 🤖 Improve report extraction using NLP
* 🌐 Deploy application on cloud (AWS / Render)
* 📱 Mobile-friendly UI

---

## 👨‍💻 Author

**Muhammad Arshaque**
B.Tech CSE Student

🔗 GitHub: https://github.com/Arshaq08

---

## 📄 License

This project is for educational purposes only.

---

## ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub!
