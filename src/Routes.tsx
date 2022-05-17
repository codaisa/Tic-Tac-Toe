import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

const RoutesManager: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Tic-Tac-Toe" element={<App />} />
        <Route path="/Tic-Tac-Toe/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesManager;
