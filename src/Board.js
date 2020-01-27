import React from "react";
import "./Board.css";
import Square from "./Square";

const BOARD_SIZE = 9;
const TEST_BOARD = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      selectedSquare: null
    };
  }

  createBoard() {
    return TEST_BOARD;
  }

  onSquareClick(id) {
    console.log("Chosen square", id);
    this.setState({ selectedSquare: id });
  }

  drawBoard(boardData) {
    return boardData.map((row, index_i) => {
      return (
        <tr>
          {row.map((digit, index_j) => (
            <Square
              id={index_i * BOARD_SIZE + index_j}
              value={digit === 0 ? null : digit}
              isSelected={this.state.selectedSquare}
              onClick={id => this.onSquareClick(id)}
            />
          ))}
        </tr>
      );
    });
  }

  render() {
    return (
      <table>
        <tbody>{this.drawBoard(this.state.board)}</tbody>
      </table>
    );
  }
}
