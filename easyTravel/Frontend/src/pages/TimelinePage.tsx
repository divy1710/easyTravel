import React, { useState } from "react";
import { ItineraryTimeline } from "../components/ItineraryTimeline";

const initialDays = [
  {
    id: "day-1",
    date: "2025-12-15",
    places: [
      { id: "place-1", name: "Eiffel Tower" },
      { id: "place-2", name: "Louvre Museum" },
    ],
  },
  {
    id: "day-2",
    date: "2025-12-16",
    places: [
      { id: "place-3", name: "Notre-Dame" },
      { id: "place-4", name: "Montmartre" },
    ],
  },
];

export default function TimelinePage() {
  const [days, setDays] = useState(initialDays);
  return (
    <div className="max-w-5xl mx-auto">
      <ItineraryTimeline days={days} onReorder={setDays} />
    </div>
  );
}
