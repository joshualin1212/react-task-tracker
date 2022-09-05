import "./Planner.css";
import TaskBlock from "./PlannerComp/TaskBlock";

//set up the hours in the day
const times = [];
for (let i = 6; i <= 24; i++) {
  times.push(i);
}
for (let i = 1; i <= 5; i++) {
  times.push(i);
}
//set up how we want to divide up the hours (blocks)
const minutes = 5;
let division = [];
for (let i = 0; i < 60; i = i + minutes) {
  if (i - 10 < 0) {
    division.push("0" + i);
  } else {
    division.push(i);
  }
}

function convertToCustomUnit(duration) {
  let hours = 100 * Math.floor(duration / 60);
  let minutes = duration % 60;
  return hours + minutes;
}

// check if the 5 min time block is occupied by a task. Return the task if it is.
function timeInsideTasks(hour, minute, dayPlanTasks) {
  let ret = false;
  dayPlanTasks.forEach(function (item, index) {
    if (
      parseInt(hour) * 100 + parseInt(minute) >= item.startTime &&
      parseInt(hour) * 100 + parseInt(minute) <
        item.startTime + convertToCustomUnit(item.duration) // TODO: THIS LOGIC NEEDS TO BE CONVERTED FROM 100 (number counting) -> :60 (time counting)
    ) {
      // console.log("this block is occupied by a task at time-", hour, minute);
      ret = item;
    }
  });
  return ret;
}

const Planner = ({ onDrop, dayPlanTasks }) => {
  /*
    Use the list of dayPlanTasks to set up layout.
    - For every dayPlanTask in dayPlanTask, search up start time and duration and set up block size accordingly by using CSS grid-span (every 5 min is 1 span).
    - In each other block, we have an empty block. 
    - (Implementation: In each iteration through the minute blocks, we need to skip out on adding empty blocks until the end time of the task. The number of blocks will always need to have a total of 24*6 grid spans.)
  */
  let blocks = [];
  times.forEach(function (hour, indexh) {
    division.forEach(function (minute, indexm) {
      // console.log(timeInsideTasks(hour, minute, dayPlanTasks));

      if (timeInsideTasks(hour, minute, dayPlanTasks)) {
      } else {
        blocks.push(hour + "" + minute);
      }
    });
  });
  // the above part is just useless.

  return (
    <div className="planner container">
      <h1 className="header"> Calendar </h1>
      <div className="grid">
        {/* hour label */}
        {times.map((hour) => (
          <span className="timeSection" key={hour}>
            <h3>{hour}:</h3>
          </span>
        ))}
        {/* time slots */}
        {times.map(() =>
          division.map((minute) => (
            <div
              id={"time-" + minute}
              key={minute.id}
              className="timeDivSection"
            >
              {minute}
            </div>
          ))
        )}
        {/* drop location */}

        {times.map((hour) =>
          division.map((minute) => (
            <TaskBlock
              hour={hour}
              minute={minute}
              onDrop={onDrop}
              dayPlanTask={timeInsideTasks(hour, minute, dayPlanTasks)}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default Planner;
