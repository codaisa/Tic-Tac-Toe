import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

type Props = {
  socket: any;
};

const RoutesManager: React.FC<Props> = (props: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Tic-Tac-Toe" element={<App socket={props.socket} />} />
        <Route
          path="/Tic-Tac-Toe/:id"
          element={<App socket={props.socket} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesManager;
