import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Place = { id: string; name: string; coordinates: [number, number] };

interface MapboxMapProps {
  places: Place[];
  route: [number, number][];
  selectedPlaceId?: string;
  onSelectPlace?: (id: string) => void;
  mapboxToken: string;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  places,
  route,
  selectedPlaceId,
  onSelectPlace,
  mapboxToken,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken = mapboxToken;
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: places[0]?.coordinates || [0, 0],
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    // Clean up
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, places]);

  // Add markers and route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    (map as any)._markers?.forEach((m: mapboxgl.Marker) => m.remove());
    (map as any)._markers = [];

    // Add new markers
    places.forEach((place) => {
      const el = document.createElement("div");
      el.className = `w-4 h-4 rounded-full border-2 ${
        place.id === selectedPlaceId
          ? "bg-blue-600 border-blue-800 scale-125"
          : "bg-white border-blue-400"
      } transition-transform duration-200`;
      el.title = place.name;
      el.style.cursor = "pointer";
      el.onclick = () => onSelectPlace?.(place.id);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .addTo(map);

      (map as any)._markers.push(marker);
    });

    // Animate to selected place
    if (selectedPlaceId) {
      const sel = places.find((p) => p.id === selectedPlaceId);
      if (sel) {
        map.flyTo({ center: sel.coordinates, zoom: 14, speed: 1.2, curve: 1.5 });
      }
    }
  }, [places, selectedPlaceId, onSelectPlace]);

  // Draw route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old route
    if (map.getSource("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }

    if (route.length > 1) {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#2563eb",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
    }
  }, [route]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-96 rounded-lg shadow border"
      style={{ minHeight: 350 }}
    />
  );
};
