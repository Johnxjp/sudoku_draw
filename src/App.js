import React from "react";
import Board from "./components/Board";
import Sidebar from "./components/Sidebar";

import "./App.css";

export default function App() {
  return (
    <div id="container">
      <Sidebar />
      <div id="main">
        <Board />
      </div>
    </div>
  );
}
