import React from "react";
import "./BoardButtons.css";

const Button = props => {
  return <button {...props}>{props.text}</button>;
};

export { Button };
