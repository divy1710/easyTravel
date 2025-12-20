import React, { useState } from "react";
import { MapboxMap } from "../components/MapboxMap";

const places = [
  { id: "1", name: "Eiffel Tower", coordinates: [2.2945, 48.8584] },
  { id: "2", name: "Louvre Museum", coordinates: [2.3364, 48.8606] },
  { id: "3", name: "Notre-Dame", coordinates: [2.3499, 48.8527] },
];

const route = places.map((p) => p.coordinates);

export default function MapPage() {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  return (
    <div className="max-w-4xl mx-auto">
      <MapboxMap
        places={places}
        route={route}
        selectedPlaceId={selected}
        onSelectPlace={setSelected}
        mapboxToken={import.meta.env.VITE_MAPBOX_TOKEN}
      />
    </div>
  );
}
