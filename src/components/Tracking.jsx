import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Recenter = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
};

const Tracking = () => {
  const [location, setLocation] = useState({
    lat: 10.0,
    lng: 76.0,
  });

  const [address, setAddress] = useState("");

  // =========================
  // FETCH STAFF LOCATION
  // =========================
  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        "https://preethu17.pythonanywhere.com/api/tracking/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      // If API returns array
      if (Array.isArray(data) && data.length > 0) {
        setLocation({
          lat: data[0].latitude,
          lng: data[0].longitude,
        });
      }

      // If API returns single object
      else if (data.latitude && data.longitude) {
        setLocation({
          lat: data.latitude,
          lng: data.longitude,
        });
      }

    } catch (err) {
      console.log("Tracking Error:", err);
    }
  };

  // =========================
  // SEARCH ADDRESS
  // =========================
  const searchLocation = async () => {
    if (!address) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        alert("Location not found");
      }

    } catch (err) {
      console.log("Search Error:", err);
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================
  useEffect(() => {
    fetchTracking();

    const interval = setInterval(fetchTracking, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      <h2 className="text-2xl font-bold mb-4">
        Live Tracking Map
      </h2>

      {/* SEARCH BAR */}
      <div className="flex gap-2 mb-4">

        <input
          type="text"
          placeholder="Enter address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border px-4 py-2 rounded w-full text-black"
        />

        <button
          onClick={searchLocation}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

      </div>

      {/* MAP */}
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        className="h-96 w-full rounded-xl"
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter
          lat={location.lat}
          lng={location.lng}
        />

        <Marker position={[location.lat, location.lng]}>
          <Popup>
            Selected Location
          </Popup>
        </Marker>

      </MapContainer>

      {/* COORDINATES */}
      <div className="mt-4 text-gray-400">
        Lat: {location.lat} | Lng: {location.lng}
      </div>

    </div>
  );
};

export default Tracking;