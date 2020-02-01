import React from "react";
import "./Square.css";

function setClass(isFixed, isSelected) {
  if (!isFixed && !isSelected) {
    return "clickable-square";
  }
  if (!isFixed && isSelected) {
    return "clickable-square selected";
  }
  return "fixed-square";
}

export default function Square(props) {
  return (
    <td
      className={setClass(props.isFixed, props.isSelected)}
      onClick={() => (props.isFixed ? null : props.onClick(props.id))}
    >
      {props.value}
    </td>
  );
}
