import { FaTimes } from "react-icons/fa";

const TaskBlock = ({
  hour,
  minute,
  onDrop,
  dayPlanTask,
  onDragEnd,
  onDragStart,
  onDelete,
}) => {
  //empty droppable elements
  if (dayPlanTask === false) {
    return (
      <div
        key={"time-" + hour + minute}
        id={"time-" + hour + minute}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(e) => onDrop(e, "#time-" + hour + minute)}
        className="drop"
      >
        {/* {parseInt(hour * 100) + parseInt(minute)} */}
      </div>
    );
  }

  // During the first occurence, we put in the task. We stretch the gridRow according to the duration (numBlocksOccupied).
  if (dayPlanTask.startTime == parseInt(hour) * 100 + parseInt(minute)) {
    const numBlocksOccupied = (Math.round(dayPlanTask.duration / 5) * 5) / 5;
    // console.log(
    //   "first occurence time: " + (parseInt(hour) * 100 + parseInt(minute)),
    //   "number of blocks occupied: " + numBlocksOccupied
    // );
    return (
      <div
        key={"time-" + hour + minute}
        id={"time-" + hour + minute}
        className="plannerTask"
        style={{
          gridRow: "span " + numBlocksOccupied,
          fontSize: `${numBlocksOccupied * 1.4 + 11}px `,
        }}
        onDragStart={(e) => {
          onDragStart(e, dayPlanTask);
          e.dataTransfer.setData("plantask", JSON.stringify(dayPlanTask));
        }}
        onDragEnd={(e) => onDragEnd(e, dayPlanTask)}
        draggable="true"
        // contentEditable="true"
      >
        {dayPlanTask.text}{" "}
        <FaTimes
          style={{ color: "crimson", cursor: "pointer" }}
          onClick={() => onDelete(dayPlanTask.id)}
        />
      </div>
    );
  }
};

export default TaskBlock;
