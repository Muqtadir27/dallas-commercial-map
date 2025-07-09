# 🏙️ Dallas Commercial Property Insights 🔍
***Welcome to the Dallas Commercial Property Intelligence platform*** — a full-stack solution designed to help entrepreneurs, investors, and analysts identify property opportunities across Dallas using real-time geospatial visualization and price prediction.

---
## 📌 Key Highlights
* ✅ Data sourced from the Attom Property API
* ✅ Machine Learning-based price prediction (Zestimate)
* ✅ Interactive React Leaflet map showing occupancy, rent, and value
* ✅ RESTful Flask backend API
* ✅ Fully deployed on Render (Frontend + Backend)
* ✅ Dynamic Power BI Dashboard for business insights
---
## 📊 Problem Statement
````
 How can we make property investment decisions more data-driven?
````

* Many commercial property owners and renters lack the tools to:
* Compare rent vs. value across neighborhoods      
* See which properties are vacant/occupied    
* Predict market value with only partial information    
* Visualize location-based insights with clarity     
---

## 🧠 My Approach
* 🏗️ Collected commercial property data using Attom API
* 🔬 Cleaned and selected top features based on correlation
* 🤖 Trained a Linear Regression model to predict Zestimate
* 🧾 Added a CORS-enabled Flask API to serve predictions as JSON
* 🗺️ Built a React + Leaflet frontend to show clickable map markers
* 📈 Created a professional Power BI dashboard for visual analytics
---

## 🎬 Live Demo

[](https://github.com/user-attachments/assets/a7a3c2b3-5223-43b8-a590-4bb8a3a15de4)
> Prediction Video

[](https://github.com/user-attachments/assets/4b02614b-2198-43d1-af73-5e4f083f62d7)
> Final Video

▶️ Here the official link to Dallas Commercial Property Prediction & Mapping project.
* 🌐 https://dallas-map.onrender.com	
---

## 📁 Project Structure
```
bash
Copy
Edit
dallas-commercial-map/
│
├── backend/
│   ├── app.py                # Flask API endpoint
│   ├── predicted_property_prices.csv
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.js            # Map + Sidebar + API integration
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── PowerBI/
    └── Dallas_Property_Insights.pbix   # Dashboard file
```
---

## 💻 How to Run Locally
### Backend (Flask)
```
bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                   # Runs on http://localhost:5000
```
### Frontend (React)
```
bash
Copy
Edit
cd frontend
npm install
npm start                       # Runs on http://localhost:3000
```
Make sure the API endpoint in ***App.js*** points to ***http://localhost:5000/api/dallas-commercial-properties*** if testing locally.

---
## 📈 Power BI Dashboard
### Visuals Created:
<img width="1166" height="665" alt="Image" src="https://github.com/user-attachments/assets/feeb81dd-4a43-4ff1-8d1d-73bd3717940d" />
### Question Answered	Chart Type              
* What’s the occupancy breakdown of commercial properties?	🥧 Pie Chart          
* What are the average rents & values by occupancy type?	📊 Bar Chart                 
* How are properties distributed across latitude/longitude?	🗺️ Map Plot            
* What is the year-wise trend of property development?	📈 Line/Column Chart                 
* What’s the rent-to-value ratio for each type?	📉 Bar Chart         
* How do rent, age, and building size correlate to price?	🔄 Scatter Plot              

---
## 🧪 Sample API Response
GET /API/Dallas-commercial-properties
```
json
Copy
Edit
{
  "properties": [
    {
      "address": "2301 MARBURG ST, DALLAS, TX 75215",
      "latitude": 32.752413,
      "longitude": -96.761233,
      "year_built": 1999,
      "lot_size_sqft": 7754,
      "building_size": 1350,
      "price": 217357.57,
      "rent": 1858,
      "occupancy_status": "Vacant"
    },
    ...
  ]
}
```
---
## 📦 Technologies Used    
* Frontend	React, Leaflet.js         
* Backend	Flask, pandas      
* Machine Learning	Scikit-learn (Linear Regression)          
* Visualization	Power BI        
* Deployment	Render (Frontend & Backend)          
* Data Source: Attom Property API               

---
## 🧠 Learnings & Challenges
* Managing CORS between the backend/frontend on Render
* Optimizing property data for model accuracy
* Integrating Power BI with geospatial filtering
* Designing a responsive UI for business users

---

## 🙌 Author
Mohammed Abdul Muqtadir💙

---
## ⭐ Star this Repo if You Found it Useful!
Your support helps me build more open-source data solutions!
