// Import DnD components from @hello-pangea/dnd (maintained fork of react-beautiful-dnd)
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Import the individual task card component
import TaskCard from "./TaskCard";

// Import the empty state component shown when no tasks exist
import EmptyState from "./EmptyState";

/**
 * TaskList
 * Renders the filterable, drag-and-droppable list of task cards.
 *
 * Props:
 *   tasks      — array of task objects to display (already filtered)
 *   allEmpty   — true if there are zero tasks total (not just filtered to zero)
 *   onToggle   — called with (id) to toggle completion
 *   onEdit     — called with (task) to open edit modal
 *   onDelete   — called with (task) to open delete confirmation
 *   onReorder  — called with (orderedIds) after a drag-and-drop ends
 *   filter     — currently active filter string (used in empty message)
 */
export default function TaskList({
  tasks,
  allEmpty,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  filter,
}) {
  /**
   * handleDragEnd
   * Fired by @hello-pangea/dnd when the user releases a dragged card.
   * @param {Object} result — contains source and destination indices
   */
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    // Drop outside a droppable zone — destination is null; do nothing
    if (!destination) return;

    // Drop in the same position — no reordering needed
    if (destination.index === source.index) return;

    // Build a new array with the moved item in its new position
    const reordered = Array.from(tasks); // shallow clone so we don't mutate state directly
    const [removed] = reordered.splice(source.index, 1); // remove the card from its original position
    reordered.splice(destination.index, 0, removed);     // insert it at the new position

    // Call the parent handler with just the IDs in their new order
    onReorder(reordered.map((t) => t.id));
  };

  // --- Empty State ---
  // Show the illustrated empty state when there are zero tasks at all
  if (allEmpty) {
    return <EmptyState />;
  }

  // Show a simpler message when tasks exist but none match the current filter/search
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-display text-lg text-charcoal-800 opacity-60">
          No {filter !== "all" ? filter : ""} tasks found
        </p>
        <p className="text-sm text-charcoal-700 opacity-40 mt-1">
          Try adjusting your filter or search query.
        </p>
      </div>
    );
  }

  return (
    // DragDropContext wraps the entire drag-and-drop zone
    // onDragEnd is the required callback — called when a drag operation finishes
    <DragDropContext onDragEnd={handleDragEnd}>
      {/*
        Droppable marks this div as a drop target.
        droppableId must be unique within the DragDropContext.
        The render-prop pattern (provided, snapshot) gives access to drag state.
      */}
      <Droppable droppableId="task-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}          // attaches DnD's internal ref to this element
            {...provided.droppableProps}      // injects required DnD data attributes
            className={`space-y-3 transition-colors duration-200 min-h-[60px] rounded-2xl
              ${snapshot.isDraggingOver ? "bg-sage-400/5" : ""} // tint drop zone while dragging
            `}
          >
            {/* Render each task as a Draggable */}
            {tasks.map((task, index) => (
              /*
                Draggable wraps each item.
                draggableId must be unique and stable (the task's UUID is perfect).
                index is required so DnD can track position during drag.
              */
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}          // DnD ref on the draggable root element
                    {...provided.draggableProps}      // applies transform styles during drag
                    // Apply the dragging class for elevated shadow and tilt
                    className={snapshot.isDragging ? "dragging-card" : ""}
                  >
                    <TaskCard
                      task={task}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                      // dragHandle is spread onto the drag handle element inside TaskCard
                      dragHandle={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {/*
              Placeholder: maintains the height of the list while an item is being dragged.
              Must be inside the Droppable's ref element.
            */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
