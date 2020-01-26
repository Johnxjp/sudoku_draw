import React from "react";
import "./Board.css";

const BOARD_SIZE = 9;

function createBoard() {
  let board = [];
  for (let i = 0; i <= BOARD_SIZE; i++) {
    let col = [];
    for (let j = 0; j <= BOARD_SIZE; j++) {
      col.push(<td>{j}</td>);
    }
    board.push(<tr>{col}</tr>);
  }
  return board;
}

// TODO: Switch to class Component
export default function Board() {
  return (
    <table>
      <tbody>{createBoard()}</tbody>
    </table>
  );
}
