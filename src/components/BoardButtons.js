import React from "react";

import "../style/BoardButtons.css";

const Button = props => {
  return <button {...props}>{props.text}</button>;
};

export default Button;
