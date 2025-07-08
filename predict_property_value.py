# predict_property_value.py

import pandas as pd
import numpy as np
import joblib

# STEP 1: Load cleaned dataset
df = pd.read_csv('selected_property_features.csv')

# STEP 2: Clean numeric columns
numeric_cols = ['latitude', 'longitude', 'year_built', 'lot_size_sqft', 'building_size', 'Zestimate', 'Rent']
for col in numeric_cols:
    df[col] = df[col].astype(str).str.replace(r'[\$,]', '', regex=True)
    df[col] = pd.to_numeric(df[col], errors='coerce')

df.dropna(subset=numeric_cols, inplace=True)

# STEP 3: Feature engineering
df['age'] = 2025 - df['year_built']  # If you're in 2025

# STEP 4: Load model & scaler
model = joblib.load('price_predictor.pkl')
scaler = joblib.load('feature_scaler.pkl')

# STEP 5: Predict
features = ['latitude', 'longitude', 'age', 'lot_size_sqft', 'building_size', 'Rent']
X = df[features]
X_scaled = scaler.transform(X)

df['Predicted_Zestimate'] = np.expm1(model.predict(X_scaled))

# STEP 6: Save results
df.to_csv('predicted_property_prices.csv', index=False)
print("✅ Predictions saved to predicted_property_prices.csv")
