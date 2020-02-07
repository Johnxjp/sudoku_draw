import React from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "./BoardButtons";
import { ErrorMessage, DrawingError } from "./ErrorMessage";
import { parseBase64String, predictDigit } from "../Utils";
import ProbabilityChart from "./Chart";

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
      errorType: DrawingError.NO_ERROR,
      probabilities: this.zeroProbabilities()
    };
  }

  zeroProbabilities() {
    const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return range.map(digit => {
      return { name: digit, probability: 0, threshold: 80 };
    });
  }

  clear() {
    this.setState({
      errorType: DrawingError.NO_ERROR,
      probabilities: this.zeroProbabilities()
    });
    this.canvas.clear();
  }

  undo() {
    this.setState({
      errorType: DrawingError.NO_ERROR,
      probabilities: this.zeroProbabilities()
    });
    this.canvas.undo();
  }

  evaluate(updateSquare) {
    this.setState({ errorType: DrawingError.NO_ERROR });
    if (this.canvas.lines.length > 0) {
      const base64ImageData = parseBase64String(this.canvas.ctx);
      predictDigit(base64ImageData)
        .then(response => {
          const prediction = response.prediction;
          let probabilities = response.probabilities;
          probabilities = probabilities.map(data => {
            return { name: data[0], probability: data[1], threshold: 80 };
          });
          console.log(probabilities);
          if (prediction > 0) {
            updateSquare(prediction);
            this.setState({ probabilities });
          } else {
            this.setState({
              errorType: DrawingError.INVALID_PREDICTION,
              probabilities
            });
          }
        })
        .catch(() => {
          this.setState({
            errorType: DrawingError.ERROR_FROM_SERVER,
            probabilities: this.zeroProbabilities()
          });
        });
    }
  }
  render() {
    console.log(this.state.probabilities);
    return (
      <div id="canvas-container">
        <div id="drawing-section">
          <CanvasDraw
            {...canvasProps}
            className="canvas"
            ref={canvas => (this.canvas = canvas)}
          />
          <ProbabilityChart data={this.state.probabilities} />
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
