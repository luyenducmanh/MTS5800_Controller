import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import App from "../app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function RootRounter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </MemoryRouter>
  );
}
