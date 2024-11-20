import * as React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <Dashboard />
      </StyledEngineProvider>
    </React.StrictMode>
  );
}
