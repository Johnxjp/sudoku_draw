import React from "react";
import "./BoardButtons.css";

const SolveButton = props => {
  return (
    <button className="board-btn" id="solve-btn" onClick={props.onClick}>
      Solve
    </button>
  );
};

const ResetButton = props => {
  return (
    <button className="board-btn" id="reset-btn" onClick={props.onClick}>
      Reset
    </button>
  );
};

const CheckButton = props => {
  return (
    <button className="board-btn" id="check-btn" onClick={props.onClick}>
      Check
    </button>
  );
};

export { SolveButton, ResetButton, CheckButton };
