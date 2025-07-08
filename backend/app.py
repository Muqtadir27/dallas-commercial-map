import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://dallas-map.onrender.com"}})

@app.route('/api/dallas-commercial-properties', methods=['GET'])
def get_predicted_properties():
    df = pd.read_csv('predicted_property_prices.csv')

    properties = []
    for _, row in df.iterrows():
        lat = row.get('latitude')
        lon = row.get('longitude')

        if pd.notna(lat) and pd.notna(lon):
            # Occupancy status cleanup
            occupancy_status = 'Unknown'
            if 'Occupancy_status' in df.columns:
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
                'year_built': int(row.get('year_built')) if not pd.isna(row.get('year_built')) else 'N/A',
                'lot_size_sqft': row.get('lot_size_sqft', 'N/A'),
                'building_size': row.get('building_size', 'N/A'),
                'price': row.get('Predicted_Zestimate', 'N/A'),
                'rent': row.get('Rent', 'N/A')
            })

    return jsonify({'properties': properties})

if __name__ == '__main__':
    app.run(debug=True)
