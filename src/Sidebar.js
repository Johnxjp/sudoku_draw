//Copyright (c) 2016-2017 Shafeen Tejani. Released under GPLv3.
import React from "react";
import ExampleImage from "./assets/example_input.png";
import "./Sidebar.css";

const Sidebar = () => (
  <aside className="sidebar">
    <h1 id="app-title">Sudoku Draw</h1>
    <p>
      Sudoku Draw is an implementation of Sudoku with a slight spin. Instead of
      typing digits in, you must draw the numbers using the canvas.{" "}
      <em>
        Simply click on the cell you want to fill and draw the image in the
        canvas
      </em>
      .
    </p>
    <h2 className="app-subtitle">How it works?</h2>
    <p>
      A neural network was buit to identify hand-drawn digits. It was trained on
      the{" "}
      <a
        href="http://yann.lecun.com/exdb/mnist/"
        target="_blank"
        rel="noopener noreferrer"
      >
        MNIST
      </a>{" "}
      dataset using{" "}
      <a href="https://pytorch.org/" target="_blank" rel="noopener noreferrer">
        PyTorch
      </a>
      .
    </p>
    <p>
      The model comprises a single convolutional layer followed by two linear
      layers. A dropout layer is also added before the penultimate linear layer.
    </p>
    <p>
      The MNIST dataset is extremely well curated - the digits in the dataset
      are centered and large. Things are not quite as nice in reality. So to
      help recognition, we first preprocess the canvas image by centering the
      input. In addition, dropout is <b>kept on</b> at inference time and the
      input is passed through the model more than once (in fact, 100 times).
      Because dropout is kept on, each time the input is passed through the
      model the softmax probabilities will be different. If the input is
      well-recognised, the model should output the right class most of the time,
      otherwise the predictions will be mixed. This is in effect can be used as
      a measure of uncertainy which a threshold can be applied to. This
      technique is known as{" "}
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
