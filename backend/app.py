import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/dallas-commercial-properties', methods=['GET'])
def get_properties():
    df = pd.read_excel('merged_property_data_cleaned.xlsx', engine='openpyxl')

    properties = []
    for _, row in df.iterrows():
        lat = row.get('location.latitude')
        lon = row.get('location.longitude')

        if pd.notna(lat) and pd.notna(lon):
            # Determine occupancy status
            absentee = str(row.get('summary.absenteeInd')).strip().upper()
            if absentee == 'OWNER OCCUPIED':
                occupancy_status = 'Occupied'
            elif absentee == 'ABSENTEE OWNER':
                occupancy_status = 'Vacant'
            else:
                occupancy_status = 'Vacant'

            # Area in acres → sqft
            area_acres = row.get('lot.lotsize1')
            area_sqft = None
            if pd.notna(area_acres):
                area_sqft = area_acres * 43560  # 1 acre = 43,560 sqft

            market_value = row.get('assessment.market.mktttlvalue')

            properties.append({
                'address': row.get('address.oneLine', 'N/A'),
                'area_sqft': round(area_sqft, 2) if area_sqft else None,
                'latitude': lat,
                'longitude': lon,
                'market_value': None if pd.isna(market_value) else market_value,
                'occupancy_status': occupancy_status
            })

    return jsonify({'properties': properties})

if __name__ == '__main__':
    app.run(debug=True)
