import Header from "./SidebarComp/Header";
import Tasks from "./SidebarComp/Tasks";
import AddTask from "./SidebarComp/AddTask";
import { FaChevronLeft } from "react-icons/fa";
const Sidebar = ({
  showAddTask,
  addTask,
  tasks,
  onDelete,
  onReminder,
  setShowAddTask,
  dragBegin,
  dragEnd,
  hideMenu,
  onDrop
}) => {
  return (
    <div id="TaskApp" className="container">
      <FaChevronLeft onClick={hideMenu} className="mobileIcon close" />
      <Header
        title="Tasks"
        onShowAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}

      {tasks.length > 0 ? (
        <Tasks
          tasks={tasks}
          onDelete={onDelete}
          onReminder={onReminder}
          dragBegin={dragBegin}
          dragEnd={dragEnd}
          onDrop={onDrop}
        />
      ) : (
        "no tasks to show"
      )}
    </div>
  );
};

export default Sidebar;
