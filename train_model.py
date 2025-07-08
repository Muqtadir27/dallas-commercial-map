# train_model.py

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
from datetime import datetime
import joblib

# STEP 1: Load dataset
df = pd.read_csv('selected_property_features.csv')

# STEP 2: Clean data (remove $, commas)
df = df.applymap(lambda x: str(x).replace(',', '').replace('$', '') if isinstance(x, str) else x)

# STEP 3: Convert columns to numeric
numeric_cols = ['latitude', 'longitude', 'year_built', 'lot_size_sqft', 'building_size', 'Zestimate', 'Rent']
df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

# STEP 4: Drop rows with missing values
df.dropna(subset=numeric_cols, inplace=True)

# STEP 5: Feature engineering
current_year = datetime.now().year
df['age'] = current_year - df['year_built']

# STEP 6: Final feature selection
features = ['latitude', 'longitude', 'age', 'lot_size_sqft', 'building_size', 'Rent']
target = 'Zestimate'

X = df[features]
y = np.log1p(df[target])  # log1p helps reduce RMSE

# STEP 7: Feature scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# STEP 8: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# STEP 9: Model training (optimized parameters)
model = GradientBoostingRegressor(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    random_state=42
)
model.fit(X_train, y_train)

# STEP 10: Evaluation
y_pred_log = model.predict(X_test)
y_pred = np.expm1(y_pred_log)
y_true = np.expm1(y_test)

r2 = r2_score(y_true, y_pred)
rmse = np.sqrt(mean_squared_error(y_true, y_pred))

print("✅ R² Score:", round(r2, 4))
print("✅ RMSE:", round(rmse, 2))

# STEP 11: Save predictions
df['Predicted_Zestimate'] = np.expm1(model.predict(scaler.transform(X)))
os.makedirs("outputs", exist_ok=True)
df.to_csv("outputs/predicted_property_prices.csv", index=False)
print("✅ Saved: outputs/predicted_property_prices.csv")

# STEP 12: Save model and scaler
joblib.dump(model, "price_predictor.pkl")
joblib.dump(scaler, "feature_scaler.pkl")
print("✅ Saved: price_predictor.pkl and feature_scaler.pkl")
