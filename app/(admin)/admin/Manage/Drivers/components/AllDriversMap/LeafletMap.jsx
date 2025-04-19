import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@heroui/react";

export default function LeafletMap({ liveLocSharingBookings }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [autoZoom, setAutoZoom] = useState(false); // State for toggling auto-zoom

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      initializeMap();
      zoomToDrivers();
    }
  }, []);

  useEffect(() => {
    if (liveLocSharingBookings) {
      updateMap(liveLocSharingBookings);
    }
  }, [liveLocSharingBookings]);

  const initializeMap = () => {
    map.current = L.map(mapContainer.current).setView([0, 0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.current
    );
  };

  const zoomToDrivers = () => {
    if (liveLocSharingBookings.length > 0) {
      const bounds = L.latLngBounds(
        liveLocSharingBookings.map((driver) => [
          driver.latitude,
          driver.longitude,
        ])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };
  const updateMap = (drivers) => {
    // Clear existing markers
    markers.current.forEach((marker) => map.current.removeLayer(marker));
    markers.current = [];

    // Filter out drivers without names
    const filteredDrivers = drivers.filter(
      (driver) =>
        driver?.driver?.firstName && driver.latitude && driver.longitude
    );

    filteredDrivers.forEach((driver) => {
      const { latitude, longitude, driver: driverInfo } = driver;

      const customIcon = L.icon({
        iconUrl: "/icons/car.png",
        iconSize: [40, 40],
        iconAnchor: [20, 80],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon })
        .addTo(map.current)
        .bindTooltip(
          `<div>
            <strong>${driverInfo.firstName}</strong>
           </div>`,
          {
            permanent: true,
            direction: "top",
          }
        );

      markers.current.push(marker);

      marker.on("click", () => zoomToDrivers(latitude, longitude));
    });

    if (autoZoom && filteredDrivers.length > 0) {
      const bounds = L.latLngBounds(
        filteredDrivers.map((driver) => [driver.latitude, driver.longitude])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <Button onClick={() => setAutoZoom(!autoZoom)}>
          {autoZoom ? "Disable Auto-Zoom" : "Enable Auto-Zoom"}
        </Button>{" "}
        <Button onClick={zoomToDrivers}>Zoom</Button>
      </div>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
