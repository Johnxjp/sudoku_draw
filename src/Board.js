import React from "react";
import Square from "./Square";
import Button from "./BoardButtons";
import { deepCopyArray, boardIdToCoords } from "./Utils";
import Canvas from "./components/Canvas";

import "./Board.css";

const BOARD_SIZE = 9;
const INITIAL_BOARD = [
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
      board: [],
      selectedSquare: null,
      fixedCells: [],
      canvas: React.createRef(),
      initialBoard: [],
      isSolved: null,
      invalidCell: null
    };
  }

  componentDidMount() {
    this.initialiseBoard();
  }

  initialiseBoard() {
    const board = Array.from(INITIAL_BOARD);
    const boardCopy = deepCopyArray(board);
    const flatBoard = board.flat();
    const fixedCells = flatBoard
      .map((val, index) => (val === 0 ? null : index))
      .filter(val => val !== null);
    const firstEmpty = flatBoard.findIndex(el => el === 0);
    this.setState({
      board: board,
      fixedCells,
      selectedSquare: firstEmpty,
      initialBoard: boardCopy
    });
  }

  onSquareClick(id) {
    console.log("Chosen square", id);
    this.setState({ selectedSquare: id, isSolved: null, invalidCell: null });
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
                isInvalid={this.state.invalidCell === id}
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

  resetClick() {
    console.log("Reset");
    const initialBoard = deepCopyArray(this.state.initialBoard);
    this.setState({ board: initialBoard, isSolved: null, invalidCell: null });
  }

  getCandidates(board, x, y) {
    const candidates = Array(BOARD_SIZE).fill(true);
    // Check row and col
    for (let k = 0; k < BOARD_SIZE; k++) {
      if (board[x][k] !== 0) {
        const val = board[x][k];
        candidates[val - 1] = false; // 0-vased index
      }
      if (board[k][y] !== 0) {
        const val = board[k][y];
        candidates[val - 1] = false; // 0-vased index
      }
    }
    // Check box - round down to nearest multiple of 3
    const startRow = x - (x % 3);
    const startCol = y - (y % 3);
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        if (board[row][col] !== 0) {
          const val = board[row][col];
          candidates[val - 1] = false;
        }
      }
    }
    let indexes = [];
    candidates.forEach((val, index) => {
      if (val) {
        indexes.push(index + 1);
      }
    });
    return indexes;
  }

  solveClick() {
    const board = this.state.board;
    let [stack, i, j, candidates] = [[], 0, 0, null];
    while (i < BOARD_SIZE && j < BOARD_SIZE) {
      if (board[i][j] === 0) {
        if (candidates === null) {
          candidates = this.getCandidates(board, i, j);
        }

        if (candidates.length === 0) {
          if (stack.length === 0) {
            return false;
          }

          [i, j, candidates] = stack.pop();
          // Reset and try again
          board[i][j] = 0;
          continue;
        } else {
          board[i][j] = candidates.pop();
          stack.push([i, j, candidates]);
          candidates = null;
        }
      }
      j = (j + 1) % BOARD_SIZE;
      if (j === 0) {
        i += 1;
      }
    }
    this.setState({ board });
    return true;
  }

  validMove(board, x, y) {
    // Check row and col
    const cellValue = board[x][y];
    const thisCellId = x * BOARD_SIZE + y;
    if (cellValue === 0) return false;
    for (let k = 0; k < BOARD_SIZE; k++) {
      if (x * BOARD_SIZE + k !== thisCellId && board[x][k] === cellValue) {
        return false;
      }

      if (k * BOARD_SIZE + y !== thisCellId && board[k][y] === cellValue) {
        return false;
      }
    }
    // Check box - round down to nearest multiple of 3
    const startRow = x - (x % 3);
    const startCol = y - (y % 3);
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        if (
          row * BOARD_SIZE + col !== thisCellId &&
          board[row][col] === cellValue
        ) {
          return false;
        }
      }
    }
    return true;
  }

  checkButtonClick() {
    const board = this.state.board;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const id = i * BOARD_SIZE + j;
        if (
          !this.state.fixedCells.includes(id) &&
          board[i][j] !== 0 &&
          !this.validMove(board, i, j)
        ) {
          this.setState({ isSolved: false, invalidCell: id });
          return;
        }
      }
    }
    this.setState({ isSolved: true, invalidCell: null });
  }

  updateSquare(value) {
    const [x, y] = boardIdToCoords(this.state.selectedSquare);
    const board = this.state.board;
    board[x][y] = value;
    this.setState({ board });
  }

  render() {
    console.log(this.state);
    return (
      <>
        <div id="board">
          <table>
            <tbody>{this.drawBoard(this.state.board)}</tbody>
          </table>
          <div id="action-btns">
            <Button
              className="board-btn"
              text="Clear Cell"
              onClick={() => this.updateSquare(0)}
            />
            <Button
              className="board-btn"
              text="Check"
              onClick={() => this.checkButtonClick()}
            />
            <Button
              className="board-btn"
              text="Reset"
              onClick={() => this.resetClick()}
            />
            <Button
              className="board-btn"
              text="Solve"
              onClick={() => this.solveClick()}
            />
          </div>
        </div>
        <Canvas updateSquare={pred => this.updateSquare(pred)} />
      </>
    );
  }
}
