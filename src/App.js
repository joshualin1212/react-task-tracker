import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { object } from "prop-types";
import Sidebar from "./components/Sidebar";
import Planner from "./components/Planner";
import { FaListAlt } from "react-icons/fa";

/*
      ------ Format of the object given to the left side: -------
      "id": 1,
      "text": "Wake up",
      "day": "July 11th 8:00 AM", (optional tentative feature)
      "duration": 10,
      "reminder": false
*/
/*
      ------ Format of the object given to the right side: -------
      "id": 1,
      "text": "Wake up, cook eggs",
      "duration": 10,
      "startTime": 6,
      "endTime": 7,
      "reminder": false
*/

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [dayPlanTasks, setdayPlanTasks] = useState([]);
  const [mouseTask, setMouseTask] = useState({});

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();

    const getPlanTasks = async () => {
      const tasksFromServer = await fetchPlanTasks();
      setdayPlanTasks(tasksFromServer);
    };
    getPlanTasks();
  }, []);

  // fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  };

  // fetch tasks in plan
  const fetchPlanTasks = async () => {
    const res = await fetch("http://localhost:5000/dayPlanTasks");
    const data = await res.json();
    return data;
  };

  // add task
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
  };

  // delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
    console.log("delete", id);
  };

  // Toggle remimnder
  const toggleReminder = (id) => {
    console.log(tasks.id);
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              reminder: !task.reminder,
            }
          : task
      )
    );
  };

  const dragBegin = (e, task) => {
    setMouseTask(task);
    console.log(mouseTask);
  };
  const dragEnd = (e, task) => {
    setMouseTask({});
    console.log(mouseTask);
  };

  // add day planner task to DB
  const addDayPlannerTask = async (dayPlanTask) => {
    const res = await fetch(`http://localhost:5000/dayPlanTasks`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(dayPlanTask),
    });
    const newDayTask = await res.json();
    setdayPlanTasks([...dayPlanTasks, newDayTask]);
    console.log(dayPlanTasks);
  };

  function convertToCustomUnit(duration) {
    let hours = 100 * Math.floor(duration / 60);
    let minutes = duration % 60;
    return hours + minutes;
  }

  const onDrop = (e, element) => {
    e.preventDefault();
    const dropLocation = document.querySelector(element);
    console.log(document.querySelector(element));
    if (e.dataTransfer.types.includes("task")) {
      e.preventDefault();
      const dataString = e.dataTransfer.getData("task");
      const data = JSON.parse(dataString);
      const time = dropLocation.id.substring(5); //this will get the time using the ID
      // console.log(time);
      const newDayTask = {
        ...data,
        id: "",
        startTime: parseInt(time),
        endTime: parseInt(time) + convertToCustomUnit(parseInt(data.duration)),
      };
      // console.log(newDayTask);
      addDayPlannerTask(newDayTask); //TURN THIS BACK ON LATER
    }
  };

  var menu = document.getElementById("TaskApp");
  function showMenu() {
    menu.style.left = "0";
    console.log("show");
  }
  function hideMenu() {
    menu.style.left = "-200px";
    console.log("hide");
  }

  return (
    <div id="everything">
      <div id="appHeaderFr"> Day Planner </div>
      <div className="flexRow">
        <FaListAlt
          onClick={showMenu}
          className="mobileIcon"
          style={{ right: "0" }}
        />

        <Sidebar
          showAddTask={showAddTask}
          addTask={addTask}
          tasks={tasks}
          onDelete={deleteTask}
          onReminder={toggleReminder}
          setShowAddTask={setShowAddTask}
          dragBegin={dragBegin}
          dragEnd={dragEnd}
          hideMenu={hideMenu}
        />

        <Planner onDrop={onDrop} dayPlanTasks={dayPlanTasks} />
      </div>
    </div>
  );
}

export default App;
