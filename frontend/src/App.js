import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue in some builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DALLAS_CENTER = [32.7767, -96.7970];

const redIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-icon-red.png",
  shadowUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-icon-green.png",
  shadowUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@1.0.0/img/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getMarkerIcon = (status) =>
  status === "Occupied" ? redIcon : greenIcon;

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
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
    fetch("https://dallas-backend.onrender.com/api/dallas-commercial-properties")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.properties) {
          const valid = data.properties.filter(
            (p) => p.latitude && p.longitude
          );
          setProperties(valid);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const total = properties.length;
  const occupied = properties.filter((p) => p.occupancy_status === "Occupied")
    .length;
  const vacant = properties.filter(
    (p) =>
      p.occupancy_status === "Vacant" || p.occupancy_status === "Unknown"
  ).length;

  const filtered = properties.filter((p) => {
    const matchesSearch = p.address
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filter === "All" ||
      (filter === "Occupied" && p.occupancy_status === "Occupied") ||
      (filter === "Vacant" &&
        (p.occupancy_status === "Vacant" || p.occupancy_status === "Unknown"));
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 350, borderRight: "1px solid #ccc", padding: 10 }}>
        <h3>Dallas Properties</h3>
        <div>
          Total: {total} |{" "}
          <span style={{ color: "red" }}>Occupied: {occupied}</span> |{" "}
          <span style={{ color: "green" }}>Vacant: {vacant}</span>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search address..."
          style={{ width: "100%", marginTop: 10, padding: 5 }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "100%", marginTop: 10, padding: 5 }}
        >
          <option value="All">All</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>

        <div style={{ marginTop: 10, maxHeight: "70vh", overflowY: "auto" }}>
          {filtered.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setFlyToPos([p.latitude, p.longitude])}
              style={{
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 5,
                marginBottom: 8,
                cursor: "pointer",
                background: "#f9f9f9",
              }}
            >
              <strong>{p.address}</strong>
              <br />
              Year: {p.year_built || "N/A"} | ${p.price ? p.price.toLocaleString() : "N/A"}
              <br />
              Rent: ${p.rent ? p.rent.toLocaleString() : "N/A"}
              <br />
              <span
                style={{
                  color: p.occupancy_status === "Occupied" ? "red" : "green",
                }}
              >
                {p.occupancy_status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={DALLAS_CENTER} zoom={12} style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
          {flyToPos && <FlyTo center={flyToPos} />}
          {filtered.map((p, i) => (
            <Marker
              key={i}
              position={[p.latitude, p.longitude]}
              icon={getMarkerIcon(p.occupancy_status)}
            >
              <Popup>
                <strong>{p.address}</strong>
                <br />
                Lat: {p.latitude} | Lon: {p.longitude}
                <br />
                Year Built: {p.year_built || "N/A"}
                <br />
                Lot Size: {Math.round(p.lot_size_sqft || 0)} sqft
                <br />
                Building Size: {Math.round(p.building_size || 0)} sqft
                <br />
                Price: ${p.price ? p.price.toLocaleString() : "N/A"}
                <br />
                Rent: ${p.rent ? p.rent.toLocaleString() : "N/A"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
