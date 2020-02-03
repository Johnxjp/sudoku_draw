import React from "react";
import ExampleImage from "../assets/example_input.png";

import "../style/Sidebar.css";

const Sidebar = () => (
  <aside className="sidebar">
    <h1 id="app-title">Sudoku Draw</h1>
    <p style={{ margin: 0 }}>
      <em>
        John Lingi,{" "}
        <a
          href="https://github.com/Johnxjp/sudoku_draw.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </em>
    </p>
    <p>
      Sudoku Draw is an implementation of Sudoku where digits must be hand-drawn
      instead of typed.{" "}
      <u>Simply select a cell, draw an image in the canvas and submit.</u>
    </p>
    <h2 className="app-subtitle">How it works?</h2>
    <p>
      A neural network is used to identify the hand-drawn digits. It was trained
      on the{" "}
      <a
        href="http://yann.lecun.com/exdb/mnist/"
        target="_blank"
        rel="noopener noreferrer"
      >
        MNIST
      </a>{" "}
      dataset using the{" "}
      <a href="https://pytorch.org/" target="_blank" rel="noopener noreferrer">
        PyTorch
      </a>{" "}
      framework.
    </p>
    <p>
      The model is a simple CNN with one convolutional layer followed by two
      linear layers. A dropout layer is also added before the penultimate linear
      layer.
    </p>
    <p>
      The MNIST dataset is extremely well curated - digits are centered and
      often large. However, things are not so quite in reality. So to aid
      recognition, the input is first preprocessed by centering and padding
    </p>
    <p>
      Also, dropout is <b>kept on</b> at inference time and the input is passed
      through the model more than once (in fact, 100 times). Each pass results
      in a different softmax output, as dropout randomnly drops a subset of
      neurons on each pass. In theory, if the input is well-recognised, the
      right class should be predicted most of the time, otherwise the
      predictions will be mixed. This is in effect a measure of uncertainy. In
      this implementation, a certain prediction is when the model predicts the
      same number over 80% of the time. This technique is known as{" "}
      <a
        href="https://arxiv.org/abs/1506.02142"
        target="_blank"
        rel="noopener noreferrer"
      >
        MC Dropout
      </a>
      .
    </p>
    <h2 className="app-subtitle">Example Drawing</h2>
    <p>
      While the probability of incorrect predictions are reduced with centering
      and using MC Dropout, try to draw the digits large and in the center.
      Here's a good example.
    </p>
    <img src={ExampleImage} alt="" height="200px" />
  </aside>
);

export default Sidebar;
