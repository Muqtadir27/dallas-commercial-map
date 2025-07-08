# predict_cli.py

import joblib
import numpy as np
from datetime import datetime

# Load the trained model and scaler
model = joblib.load("price_predictor.pkl")
scaler = joblib.load("feature_scaler.pkl")

# Take input from user
print("\nEnter Property Details:")
latitude = float(input("Latitude: "))
longitude = float(input("Longitude: "))
year_built = int(input("Year Built: "))
lot_size_sqft = float(input("Lot Size (sqft): "))
building_size = float(input("Building Size (sqft): "))
rent = float(input("Estimated Monthly Rent ($): "))

# Derived feature
current_year = datetime.now().year
age = current_year - year_built

# Prepare input
input_features = np.array([[latitude, longitude, age, lot_size_sqft, building_size, rent]])
input_scaled = scaler.transform(input_features)

# Predict
log_pred = model.predict(input_scaled)
zestimate = np.expm1(log_pred[0])

print(f"\n🏷️ Predicted Property Price: ${zestimate:,.2f}")
