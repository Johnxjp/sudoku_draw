import React from "react";

export default function Square(props) {
  return (
    <td
      className={props.isSelected === props.id ? "selected" : null}
      onClick={() => props.onClick(props.id)}
    >
      {props.value}
    </td>
  );
}
