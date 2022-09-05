import Task from "./Task";

const Tasks = ({ tasks, onDelete, onReminder, dragBegin, dragEnd}) => {
  return (
    <div className="tasks">
      {tasks.map((task) => {
        return (
          <Task
            key={task.id}
            task={task}
            onDelete={onDelete}
            onReminder={onReminder}
            dragBegin={dragBegin}
            dragEnd={dragEnd}
          />
        );
      })}
    </div>
  );
};

export default Tasks;
