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

import {
  OpenStreetMapProvider,
} from "leaflet-geosearch";

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
    map.setView([lat, lng], 14);
  }, [lat, lng]);

  return null;
};

const Tracking = () => {

  const [location, setLocation] = useState({
    lat: 10.8505,
    lng: 76.2711,
  });

  const [address, setAddress] = useState("");

  const provider = new OpenStreetMapProvider();

  // =========================
  // FETCH BOOKING LOCATION
  // =========================
  const fetchBookingLocation = async () => {

    try {

      const token = localStorage.getItem("access");

      const res = await fetch(
        "https://preethu17.pythonanywhere.com/api/booking/bookings/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("BOOKINGS =", data);

      if (Array.isArray(data) && data.length > 0) {

        // latest booking
        const latestBooking = data[data.length - 1];

        const bookingAddress = latestBooking.address;

        setAddress(bookingAddress);

        // convert address -> lat lng
        const results = await provider.search({
          query: bookingAddress,
        });

        if (results.length > 0) {

          setLocation({
            lat: results[0].y,
            lng: results[0].x,
          });

        }
      }

    } catch (err) {
      console.log("Tracking Error =", err);
    }
  };

  useEffect(() => {

    fetchBookingLocation();

  }, []);

  return (
    <div>

      <h2 className="text-2xl font-bold mb-4">
        Booking Location Tracking
      </h2>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={14}
        className="h-96 w-full rounded-xl"
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter
          lat={location.lat}
          lng={location.lng}
        />

        <Marker position={[location.lat, location.lng]}>

          <Popup>

            Booking Location <br />

            {address}

          </Popup>

        </Marker>

      </MapContainer>

      <div className="mt-4 text-black font-semibold">

        Address: {address}

      </div>

    </div>
  );
};

export default Tracking;