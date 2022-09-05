import Task from "./Task";

const Tasks = ({ tasks, onDelete, onReminder, dragBegin, dragEnd, onDrop }) => {
  return (
    <div className="tasks" onDrop={(e) => onDrop(e, "#time-")}>
      {tasks.map((task) => {
        return (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
            onReminder={onReminder}
            dragBegin={dragBegin}
            dragEnd={dragEnd}
            onDrop={onDrop}
          />
        );
      })}
    </div>
  );
};

export default Tasks;
