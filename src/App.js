import React from "react";
import Board from "./Board";
import "./App.css";
import Sidebar from "./Sidebar";

export default function App() {
  return (
    <div id="container">
      <Sidebar />
      <div id="main">
        <Board />
        {/* <Canvas /> */}
      </div>
    </div>
  );
}
