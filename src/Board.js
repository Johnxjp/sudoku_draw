import React from "react";
import Square from "./Square";
import CanvasDraw from "react-canvas-draw";

import "./Board.css";
import "./Canvas.css";

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

const canvasProps = {
  brushRadius: 5,
  lazyRadius: 2,
  hideGrid: true,
  brushColor: "black"
};

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      selectedSquare: null,
      fixedCells: [],
      canvas: React.createRef()
    };
  }

  componentDidMount() {
    this.initialiseBoard();
  }

  initialiseBoard() {
    const fixedCells = TEST_BOARD.flat()
      .map((val, index) => (val === 0 ? null : index))
      .filter(val => val !== null);

    this.setState({ board: TEST_BOARD, fixedCells });
  }

  onSquareClick(id) {
    console.log("Chosen square", id);
    this.setState({ selectedSquare: id });
  }

  drawBoard(boardData) {
    return boardData.map((row, index_i) => {
      return (
        <tr>
          {row.map((digit, index_j) => {
            const id = index_i * BOARD_SIZE + index_j;
            return (
              <Square
                id={id}
                value={digit === 0 ? null : digit}
                isSelected={this.state.selectedSquare === id}
                onClick={id => this.onSquareClick(id)}
                isFixed={this.state.fixedCells.includes(id)}
              />
            );
          })}
        </tr>
      );
    });
  }

  getbase64PNG(context) {
    let base64Data = context.drawing.canvas.toDataURL();
    return base64Data.match(/base64,(.*)/)[1];
  }

  setImg() {
    const lines = this.canvas.lines;
    if (lines.length > 0) {
      const context = this.canvas.ctx;
      const base64Data = this.getbase64PNG(context);
      return base64Data;
    } else {
      return null;
    }
  }

  render() {
    console.log(this.canvas === undefined ? null : this.canvas.current);
    return (
      <>
        <table>
          <tbody>{this.drawBoard(this.state.board)}</tbody>
        </table>
        <div id="canvas-square">
          <CanvasDraw
            {...canvasProps}
            className="canvas-square"
            ref={canvas => {
              this.canvas = canvas;
              console.log(canvas);
            }}
          />
          <button onClick={() => this.canvas.clear()}>Clear</button>
          <button onClick={() => this.canvas.undo()}>Undo</button>
          <button onClick={() => this.setImg()}>Submit</button>
        </div>
      </>
    );
  }
}
