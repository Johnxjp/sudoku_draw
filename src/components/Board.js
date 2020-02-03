import React from "react";
import Square from "./Square";
import Button from "./BoardButtons";
import { deepCopyArray } from "../Utils";
import Canvas from "./Canvas";

import "../style/Board.css";

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
      invalidCell: null
    };
  }

  componentDidMount() {
    this.initialiseBoard();
  }

  filledCells(flatBoard) {
    return flatBoard
      .map((val, index) => (val === 0 ? null : index))
      .filter(val => val !== null);
  }

  initialiseBoard() {
    const flatBoard = INITIAL_BOARD.flat();
    this.setState({
      board: INITIAL_BOARD,
      fixedCells: this.filledCells(flatBoard),
      selectedSquare: flatBoard.findIndex(el => el === 0),
      initialBoard: deepCopyArray(INITIAL_BOARD)
    });
  }

  setSelectedSquare(id) {
    this.setState({ selectedSquare: id, invalidCell: null });
  }

  boardIdToCoords(squareId) {
    const x = parseInt(squareId / BOARD_SIZE);
    const y = squareId % BOARD_SIZE;
    return [x, y];
  }

  coordsToBoardId(x, y) {
    return x * BOARD_SIZE + y;
  }

  renderRow(row, rowIndex) {
    return (
      <tr>
        {row.map((digit, colIndex) => {
          const id = this.coordsToBoardId(rowIndex, colIndex);
          return (
            <Square
              id={id}
              value={digit === 0 ? null : digit}
              isInvalid={this.state.invalidCell === id}
              isSelected={this.state.selectedSquare === id}
              isFixed={this.state.fixedCells.includes(id)}
              setSelectedSquare={id => this.setSelectedSquare(id)}
            />
          );
        })}
      </tr>
    );
  }

  renderBoard() {
    const board = this.state.board;
    return (
      <table>
        <tbody>
          {board.map((row, rowIndex) => this.renderRow(row, rowIndex))}
        </tbody>
      </table>
    );
  }

  isEmptyCell(board, x, y) {
    return board[x][y] === 0;
  }

  getCandidates(board, x, y) {
    function deleteCandidate(board, i, j, candidates) {
      const val = board[i][j];
      candidates[val - 1] = false;
      return candidates;
    }

    let candidates = Array(BOARD_SIZE).fill(true);
    // Check row and col
    for (let k = 0; k < BOARD_SIZE; k++) {
      if (!this.isEmptyCell(board, x, k)) {
        candidates = deleteCandidate(board, x, k, candidates);
      }
      if (!this.isEmptyCell(board, k, y)) {
        candidates = deleteCandidate(board, k, y, candidates);
      }
    }
    // Check box - round down to nearest multiple of 3
    const startRow = x - (x % 3);
    const startCol = y - (y % 3);
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        if (!this.isEmptyCell(board, row, col)) {
          candidates = deleteCandidate(board, row, col, candidates);
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

  solveBoard(board) {
    let [stack, i, j, candidates] = [[], 0, 0, null];
    while (i < BOARD_SIZE && j < BOARD_SIZE) {
      if (board[i][j] === 0) {
        if (candidates === null) {
          candidates = this.getCandidates(board, i, j);
        }

        if (candidates.length === 0) {
          if (stack.length === 0) {
            return null;
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
    return board;
  }

  validMove(board, x, y) {
    // Check row and col
    const cellValue = board[x][y];
    const cellId = this.coordsToBoardId(x, y);
    if (cellValue === 0) return false;
    for (let k = 0; k < BOARD_SIZE; k++) {
      if (this.coordsToBoardId(x, k) !== cellId && board[x][k] === cellValue) {
        return false;
      }

      if (this.coordsToBoardId(k, y) !== cellId && board[k][y] === cellValue) {
        return false;
      }
    }
    // Check box - round down to nearest multiple of 3
    const startRow = x - (x % 3);
    const startCol = y - (y % 3);
    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        if (
          this.coordsToBoardId(row, col) !== cellId &&
          board[row][col] === cellValue
        ) {
          return false;
        }
      }
    }
    return true;
  }

  solveClick() {
    let board = deepCopyArray(this.state.board);
    board = this.solveBoard(board);
    if (board !== null) {
      this.setState({ board });
    }
  }

  resetClick() {
    const initialBoard = deepCopyArray(this.state.initialBoard);
    this.setState({ board: initialBoard, invalidCell: null });
  }

  checkClick() {
    const board = this.state.board;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const id = this.coordsToBoardId(i, j);
        if (this.state.fixedCells.includes(id)) {
          continue;
        } else if (board[i][j] !== 0 && !this.validMove(board, i, j)) {
          this.setState({ invalidCell: id });
          return;
        }
      }
    }
    this.setState({ invalidCell: null });
  }

  updateSelectedSquare(value) {
    const [x, y] = this.boardIdToCoords(this.state.selectedSquare);
    const board = deepCopyArray(this.state.board);
    board[x][y] = value;
    this.setState({ board });
  }

  render() {
    console.log(this.state);
    return (
      <>
        <div id="board">
          {this.renderBoard()}
          <div id="action-btns">
            <Button
              className="board-btn"
              text="Clear Cell"
              onClick={() => this.updateSelectedSquare(0)}
            />
            <Button
              className="board-btn"
              text="Check"
              onClick={() => this.checkClick()}
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
        <Canvas updateSquare={pred => this.updateSelectedSquare(pred)} />
      </>
    );
  }
}
