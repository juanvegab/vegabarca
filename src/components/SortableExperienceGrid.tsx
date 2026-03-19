"use client";

import { Experience as ExperienceModel } from "@prisma/client";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import Experience from "./Experience";

function SortableItem({ experience }: { experience: ExperienceModel }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Experience
        experience={experience}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface SortableExperienceGridProps {
  experiences: ExperienceModel[];
}

export default function SortableExperienceGrid({
  experiences: initialExperiences,
}: SortableExperienceGridProps) {
  const [experiences, setExperiences] = useState(initialExperiences);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex((e) => e.id === active.id);
    const newIndex = experiences.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(experiences, oldIndex, newIndex);

    setExperiences(reordered);

    await fetch("/api/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: reordered.map((e, i) => ({ id: e.id, order: i + 1 })),
      }),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={experiences.map((e) => e.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <SortableItem key={experience.id} experience={experience} />
          ))}
          {experiences.length === 0 && (
            <p className="col-span-full">{`You don't have any experiences`}</p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
