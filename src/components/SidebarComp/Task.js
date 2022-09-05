import { FaTimes } from "react-icons/fa";
const Task = ({ task, onDelete, onReminder, dragBegin, dragEnd }) => {
  return (
    <div
      className={`task ${task.reminder ? "reminder" : ""}`}
      onDoubleClick={() => onReminder(task.id)}
      draggable="true"
      onDragStart={(e) => {
        dragBegin(e, task);
        e.dataTransfer.setData("task", JSON.stringify(task));
      }}
      onDragEnd={(e) => dragEnd(e, task)}
    >
      <h3>
        {" "}
        {task.text}{" "}
        <FaTimes
          style={{ color: "crimson", cursor: "pointer" }}
          onClick={() => onDelete(task.id)}
        />
      </h3>
      <p> {task.day} </p>
      <p> Duration: {task.duration} minutes</p>
      <p> Reminder? : {String(task.reminder)}</p>
      <p> </p>
    </div>
  );
};
export default Task;
