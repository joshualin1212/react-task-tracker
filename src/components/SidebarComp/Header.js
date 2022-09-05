import React from "react";
import Button from "./Button";

const Header = (props) => {
  return (
    <div className="header">
      <h1>{props.title}</h1>
      <Button
        text={props.showAdd ? "Close" : "Add"}
        color={props.showAdd ? "lightcoral" : "lightblue"}
        onClick={props.onShowAdd}
      />
    </div>
  );
};

Header.defaultProps = {
  title: "Task tracker",
};

export default Header;
