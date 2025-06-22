import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DALLAS_CENTER = [32.7767, -96.7970];

const redIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-icon-red.png",
  shadowUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-icon-green.png",
  shadowUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getMarkerIcon = (status) => {
  if (status === "Occupied") return redIcon;
  return greenIcon; // Treat Vacant and Unknown as Green
};

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 1 });
    }
  }, [center, map]);
  return null;
}

function App() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [flyToPos, setFlyToPos] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/dallas-commercial-properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  const total = properties.length;
  const occupied = properties.filter(p => p.occupancy_status === "Occupied").length;
  const vacant = properties.filter(p => p.occupancy_status === "Vacant" || p.occupancy_status === "Unknown").length;

  const filteredProperties = properties.filter((prop) => {
    const matchAddress = prop.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === "All" ||
      (filter === "Occupied" && prop.occupancy_status === "Occupied") ||
      (filter === "Vacant" && (prop.occupancy_status === "Vacant" || prop.occupancy_status === "Unknown"));
    return matchAddress && matchStatus;
  });

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      
      {/* Sidebar */}
      <div style={{ width: "350px", borderRight: "1px solid #ccc", padding: "10px", overflowY: "auto" }}>
        <h3 style={{ marginTop: 0 }}>Dallas Properties</h3>
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Total: {total} | <span style={{ color: "red" }}>Occupied: {occupied}</span> | <span style={{ color: "green" }}>Vacant: {vacant}</span>
        </div>

        <input
          type="text"
          placeholder="Search address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "100%", padding: "5px", marginBottom: "10px" }}>
          <option value="All">All</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>

        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {filteredProperties.map((prop, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "8px",
                cursor: "pointer",
                background: "#f9f9f9",
              }}
              onClick={() => setFlyToPos([prop.latitude, prop.longitude])}
            >
              <strong>{prop.address}</strong><br />
              {Math.round(prop.area_sqft || 0)} sqft | ${prop.market_value?.toLocaleString() || "N/A"}<br />
              <span style={{ color: prop.occupancy_status === "Occupied" ? "red" : "green" }}>
                {prop.occupancy_status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={DALLAS_CENTER} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {flyToPos && <FlyTo center={flyToPos} />}
          {filteredProperties.map((prop, index) => (
            <Marker
              key={index}
              position={[prop.latitude, prop.longitude]}
              icon={getMarkerIcon(prop.occupancy_status)}
            >
              <Popup>
                <div>
                  <strong>{prop.address}</strong><br />
                  Market Value: ${prop.market_value?.toLocaleString() || "N/A"}<br />
                  Area: {prop.area_sqft ? `${Math.round(prop.area_sqft)} sqft` : "N/A"}<br />
                  Lat: {prop.latitude} | Lon: {prop.longitude}<br />
                  Occupancy: {prop.occupancy_status || "Unknown"}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
