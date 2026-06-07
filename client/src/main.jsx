// React 18 API — ReactDOM.createRoot replaces the legacy ReactDOM.render
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import the root App component
import App from "./App";

// Import global styles — this includes Tailwind's @tailwind directives and our custom CSS
import "./styles/index.css";

// Locate the <div id="root"> element in index.html
const rootElement = document.getElementById("root");

// Create a React root and render the app inside React StrictMode
// StrictMode activates additional runtime warnings in development (e.g. detecting side effects)
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
