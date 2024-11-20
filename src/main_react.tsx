import ReactDOM from "react-dom/client";
import RootRounter from "./renderer/routes";

// Find the container element
const container = document.getElementById("root");

if (container) {
  // Create a root and render the App component
  const root = ReactDOM.createRoot(container);
  root.render(<RootRounter />);
} else {
  console.error("Root container not found");
}
