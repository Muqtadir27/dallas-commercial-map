import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# ✅ CORS: Allow your frontend domain
CORS(app, resources={r"/api/*": {"origins": "https://dallas-map.onrender.com"}})

@app.route('/api/dallas-commercial-properties', methods=['GET'])
def get_predicted_properties():
    try:
        # ✅ Check file exists
        file_path = 'predicted_property_prices.csv'
        if not os.path.exists(file_path):
            return jsonify({'error': 'Data file not found'}), 404

        df = pd.read_csv(file_path)

        # ✅ Check required columns
        required_columns = [
            'address', 'latitude', 'longitude', 'year_built',
            'lot_size_sqft', 'building_size', 'Predicted_Zestimate',
            'Rent', 'Occupancy_status'
        ]
        for col in required_columns:
            if col not in df.columns:
                return jsonify({'error': f'Missing column: {col}'}), 400

        properties = []
        for _, row in df.iterrows():
            lat = row.get('latitude')
            lon = row.get('longitude')

            if pd.notna(lat) and pd.notna(lon):
                occupancy_status = 'Unknown'
                occ = str(row.get('Occupancy_status')).strip().lower()
                if occ == 'occupied':
                    occupancy_status = 'Occupied'
                elif occ == 'vacant':
                    occupancy_status = 'Vacant'

                properties.append({
                    'address': row.get('address', 'N/A'),
                    'latitude': lat,
                    'longitude': lon,
                    'occupancy_status': occupancy_status,
                    'year_built': int(row.get('year_built')) if pd.notna(row.get('year_built')) else 'N/A',
                    'lot_size_sqft': float(row.get('lot_size_sqft')) if pd.notna(row.get('lot_size_sqft')) else 'N/A',
                    'building_size': float(row.get('building_size')) if pd.notna(row.get('building_size')) else 'N/A',
                    'price': float(row.get('Predicted_Zestimate')) if pd.notna(row.get('Predicted_Zestimate')) else 'N/A',
                    'rent': float(row.get('Rent')) if pd.notna(row.get('Rent')) else 'N/A'
                })

        return jsonify({'properties': properties})

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
