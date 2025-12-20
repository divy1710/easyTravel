import React, { useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

type Place = { id: string; name: string };
type Day = { id: string; date: string; places: Place[] };

interface Props {
  days: Day[];
  onReorder: (days: Day[]) => void;
}

export const ItineraryTimeline: React.FC<Props> = React.memo(({ days, onReorder }) => {
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination, type } = result;
      let newDays = [...days];

      if (type === "DAY") {
        const [removed] = newDays.splice(source.index, 1);
        newDays.splice(destination.index, 0, removed);
      } else if (type === "PLACE") {
        const sourceDayIdx = newDays.findIndex((d) => d.id === source.droppableId);
        const destDayIdx = newDays.findIndex((d) => d.id === destination.droppableId);
        const sourcePlaces = Array.from(newDays[sourceDayIdx].places);
        const [removed] = sourcePlaces.splice(source.index, 1);

        if (sourceDayIdx === destDayIdx) {
          sourcePlaces.splice(destination.index, 0, removed);
          newDays[sourceDayIdx] = { ...newDays[sourceDayIdx], places: sourcePlaces };
        } else {
          const destPlaces = Array.from(newDays[destDayIdx].places);
          destPlaces.splice(destination.index, 0, removed);
          newDays[sourceDayIdx] = { ...newDays[sourceDayIdx], places: sourcePlaces };
          newDays[destDayIdx] = { ...newDays[destDayIdx], places: destPlaces };
        }
      }
      onReorder(newDays);
    },
    [days, onReorder]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-days" direction="horizontal" type="DAY">
        {(provided) => (
          <div
            className="flex gap-4 overflow-x-auto p-4"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {days.map((day, dayIdx) => (
              <Draggable key={day.id} draggableId={day.id} index={dayIdx}>
                {(provided) => (
                  <div
                    className="bg-white rounded-lg shadow min-w-[280px] flex flex-col"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className="p-3 border-b font-semibold flex items-center justify-between cursor-move"
                      {...provided.dragHandleProps}
                    >
                      Day {dayIdx + 1} <span className="text-xs text-gray-400">{day.date}</span>
                    </div>
                    <Droppable droppableId={day.id} type="PLACE">
                      {(provided, snapshot) => (
                        <div
                          className={`flex-1 p-2 min-h-[80px] transition-colors ${
                            snapshot.isDraggingOver ? "bg-blue-50" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {day.places.map((place, placeIdx) => (
                            <Draggable key={place.id} draggableId={place.id} index={placeIdx}>
                              {(provided) => (
                                <div
                                  className="bg-blue-100 rounded p-2 mb-2 shadow-sm flex items-center cursor-move"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <span className="truncate">{place.name}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});
