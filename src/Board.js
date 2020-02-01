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
  brushRadius: 18,
  lazyRadius: 1,
  hideGrid: true,
  brushColor: "black",
  canvasWidth: 196,
  canvasHeight: 196
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
    const flatBoard = TEST_BOARD.flat();
    const fixedCells = flatBoard
      .map((val, index) => (val === 0 ? null : index))
      .filter(val => val !== null);
    const firstEmpty = flatBoard.findIndex(el => el === 0);
    this.setState({
      board: TEST_BOARD,
      fixedCells,
      selectedSquare: firstEmpty
    });
  }

  onSquareClick(id) {
    console.log("Chosen square", id);
    if (id !== this.state.selectedSquare) {
      // Clear canvas
      this.canvas.clear();
    }
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

  getBoardCoords(squareId) {
    const x = parseInt(squareId / BOARD_SIZE);
    const y = squareId % BOARD_SIZE;
    return [x, y];
  }

  evaluate() {
    const lines = this.canvas.lines;
    // TODO: Remove geq
    if (lines.length >= 0) {
      const context = this.canvas.ctx;
      const base64Data = this.getbase64PNG(context);
      this.getPrediction(base64Data)
        .then(data => {
          const prediction = data.prediction;
          if (prediction < 0) {
            console.log("Couldn't understand input");
          } else if (prediction === 0) {
            console.log("Not a valid value");
          } else {
            console.log("Predicted value", prediction);
            const [x, y] = this.getBoardCoords(this.state.selectedSquare);
            const board = this.state.board;
            board[x][y] = prediction;
            this.setState({ board });
          }
        })
        .catch(err => console.log(err));
    } else {
      return null;
    }
  }

  async getPrediction(base64Data) {
    // return new Promise((resolve, _) => {
    //   const val = getRandomInt(0, BOARD_SIZE + 1);
    //   console.log("Generated Num", val);
    //   resolve({ value: val });
    // });
    const url = "http://localhost:3001/predict";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost/3001"
      },
      body: JSON.stringify({ data: base64Data })
    });
    return await response.json();
  }

  render() {
    return (
      <>
        <table>
          <tbody>{this.drawBoard(this.state.board)}</tbody>
        </table>
        <div id="canvas-container">
          <CanvasDraw
            {...canvasProps}
            className="canvas"
            ref={canvas => {
              this.canvas = canvas;
            }}
          />
          <button onClick={() => this.canvas.clear()}>Clear</button>
          <button onClick={() => this.canvas.undo()}>Undo</button>
          <button onClick={() => this.evaluate()}>Submit</button>
        </div>
      </>
    );
  }
}
