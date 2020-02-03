import React from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "./BoardButtons";
import { ErrorMessage, DrawingError } from "./ErrorMessage";
import { parseBase64String, predictDigit } from "../Utils";

import "../style/Canvas.css";

const canvasProps = {
  brushRadius: 16,
  lazyRadius: 1,
  hideGrid: true,
  brushColor: "black",
  canvasWidth: 224,
  canvasHeight: 224
};

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: React.createRef(),
      errorType: DrawingError.NO_ERROR
    };
  }

  clear() {
    this.setState({ errorType: DrawingError.NO_ERROR });
    this.canvas.clear();
  }

  undo() {
    this.setState({ errorType: DrawingError.NO_ERROR });
    this.canvas.undo();
  }

  evaluate(updateSquare) {
    this.setState({ errorType: DrawingError.NO_ERROR });
    if (this.canvas.lines.length > 0) {
      const base64ImageData = parseBase64String(this.canvas.ctx);
      predictDigit(base64ImageData)
        .then(response => {
          const prediction = response.prediction;
          if (prediction > 0) {
            updateSquare(prediction);
          } else {
            this.setState({ errorType: DrawingError.INVALID_PREDICTION });
          }
        })
        .catch(() => {
          this.setState({ errorType: DrawingError.ERROR_FROM_SERVER });
        });
    }
  }
  render() {
    return (
      <div id="canvas-container">
        <div id="drawing-section">
          <CanvasDraw
            {...canvasProps}
            className="canvas"
            ref={canvas => (this.canvas = canvas)}
          />
          <ErrorMessage error={this.state.errorType} />
        </div>
        <div id="canvas-btns">
          <Button
            className="canvas-btn"
            text="Clear Canvas"
            onClick={() => this.clear()}
          />
          <Button
            className="canvas-btn"
            text="Undo"
            onClick={() => this.undo()}
          />
          <Button
            className="canvas-btn"
            text="Submit"
            onClick={() => this.evaluate(this.props.updateSquare)}
          />
        </div>
      </div>
    );
  }
}
