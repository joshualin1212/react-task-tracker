import { useState } from "react";

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [day, setDay] = useState("");
  const [duration, setDuration] = useState(0);
  const [reminder, setReminder] = useState(false);
  const checkBoxSizeMultiplier = 1.3;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert("please add a task");
      return;
    }
    onAdd({ text, day, duration, reminder });
    //clear form
    setText("");
    setDay("");
    setDuration("");
    setReminder(false);
  };

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Task</label>
        <input
          type="text"
          value={text}
          placeholder="Add Task"
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div className="form-control">
        <label>Date and Time</label>
        <input
          type="text"
          value={day}
          placeholder="Add Date and Time (optional)"
          onChange={(e) => setDay(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label>Duration</label>
        <input
          type="text"
          value={duration}
          placeholder="Add Duration (in increments of 5 minutes)"
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      <div
        className="form-control"
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <label>Set Reminder</label>

        <input
          type="checkbox"
          style={{
            margin: "auto",
            transform: `scale(${checkBoxSizeMultiplier})`,
          }}
          checked={reminder}
          value={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div>
      <input type="submit" value="Save Task" className="btn btn-block" />
    </form>
  );
};

export default AddTask;
