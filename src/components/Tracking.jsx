import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng]);

  return null;
};

const Tracking = () => {
  const [location, setLocation] = useState({
    lat: 10.0,
    lng: 76.0,
  });

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

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      if (data.latitude && data.longitude) {
        setLocation({
          lat: data.latitude,
          lng: data.longitude,
        });
      }
    } catch (err) {
      console.log("Tracking error:", err);
    }
  };

  useEffect(() => {
    fetchTracking();

    const interval = setInterval(fetchTracking, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Live Tracking Map</h2>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        className="h-96 w-full rounded-xl"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter lat={location.lat} lng={location.lng} />

        <Marker position={[location.lat, location.lng]}>
          <Popup>Staff Current Location</Popup>
        </Marker>
      </MapContainer>

      <div className="mt-4 text-gray-400">
        Lat: {location.lat} | Lng: {location.lng}
      </div>
    </div>
  );
};

export default Tracking;