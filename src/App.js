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
  const [dayPlanTasks, setDayPlanTasks] = useState([]);
  const [mouseTask, setMouseTask] = useState({});

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
    const getPlanTasks = async () => {
      const tasksFromServer = await fetchPlanTasks();
      setDayPlanTasks(tasksFromServer);
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

  // delete task from the planner on the right
  const deleteDayPlanTask = async (id) => {
    await fetch(`http://localhost:5000/dayPlanTasks/${id}`, {
      method: "DELETE",
    });
    setDayPlanTasks(dayPlanTasks.filter((task) => task.id !== id));
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
    setDayPlanTasks([...dayPlanTasks, newDayTask]);
    console.log(dayPlanTasks, "task added");
  };

  //util- converts a duration (minutes only) so that it in the format of {00}{00}{hour}{minute} stored in a single number
  function convertToCustomUnit(duration) {
    let hours = 100 * Math.floor(duration / 60);
    let minutes = duration % 60;
    return hours + minutes;
  }

  //util- checks if the start time + duration overlaps with anything in our dayPlanTasks
  function isTimeOverlap(dropStartTime, duration) {
    let ret = false;
    //time is in format {00}{00} => {hour}{minutes}
    dayPlanTasks.map((dayPlanTask) => {
      // console.log(
      //   dropStartTime,
      //   duration,
      //   convertToCustomUnit(parseInt(duration)),
      //   dropStartTime + convertToCustomUnit(parseInt(duration))
      // );
      // console.log(dayPlanTask.startTime, dayPlanTask.endTime);
      if (
        dropStartTime < dayPlanTask.startTime &&
        dayPlanTask.startTime <=
          dropStartTime + convertToCustomUnit(parseInt(duration))
      ) {
        ret = true;
      }
    });
    return ret;
  }

  const onDrop = (e, element) => {
    e.preventDefault();
    const dropLocation = document.querySelector(element);
    console.log(document.querySelector(element));

    // TRANSFERING FROM LEFT TO RIGHT
    if (e.dataTransfer.types.includes("task")) {
      const dataString = e.dataTransfer.getData("task");
      const data = JSON.parse(dataString);
      const dropStartTime = dropLocation.id.substring(5); //this will get the time using the ID
      // console.log(dropStartTime);

      console.log(
        isTimeOverlap(parseInt(dropStartTime), parseInt(data.duration)),
        "hello"
      );

      if (isTimeOverlap(parseInt(dropStartTime), parseInt(data.duration))) {
        //overlap, do not add into db
        alert("Action cannot be done. There is an overlap of time!");
      } else {
        // no overlap, safe to put into the db

        const newDayTask = {
          ...data,
          id: "",
          startTime: parseInt(dropStartTime),
          endTime:
            Math.floor(parseInt(dropStartTime) / 100) * 100 +
            convertToCustomUnit(
              (parseInt(dropStartTime) % 100) + parseInt(data.duration)
            ),
        };
        // console.log(newDayTask);
        addDayPlannerTask(newDayTask);
      }
    }

    // TRANSFER FROM RIGHT TO LEFT
    else if (e.dataTransfer.types.includes("plantask")) {
      const dataString = e.dataTransfer.getData("plantask");
      const data = JSON.parse(dataString);

      let { startTime, endTime, ...cleaned } = data; //this syntax will take out the object properties we want to omit when transfering the data over to the left side.

      const newTask = {
        ...cleaned,
        id: "",
      };
      // console.log(newTask);
      addTask(newTask);
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
          onDrop={onDrop}
        />

        <Planner
          onDrop={onDrop}
          dayPlanTasks={dayPlanTasks}
          onDragBegin={dragBegin}
          onDragEnd={dragEnd}
          deleteDayPlanTask={deleteDayPlanTask}
        />
      </div>
    </div>
  );
}

export default App;
