import React from "react";

import "../style/Square.css";

function setClass(isFixed, isSelected, isInvalid) {
  if (isFixed) return "fixed-square";
  if (isInvalid) return "clickable-square invalid-square";
  if (isSelected) return "clickable-square selected";
  return "clickable-square";
}

export default function Square(props) {
  return (
    <td
      className={setClass(props.isFixed, props.isSelected, props.isInvalid)}
      onClick={() => (props.isFixed ? null : props.setSelectedSquare(props.id))}
    >
      {props.value}
    </td>
  );
}
