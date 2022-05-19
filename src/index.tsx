import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import RoutesManager from "./Routes";
import { io } from "socket.io-client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

/* const socket = io("ws://localhost:3001"); */
const socket = io("https://game-tic-tac-toee.herokuapp.com/");
socket.connect();

root.render(
  <React.StrictMode>
    <RoutesManager socket={socket} />
  </React.StrictMode>
);
