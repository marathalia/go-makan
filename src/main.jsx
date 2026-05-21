import React from "react";
import { createRoot } from "react-dom/client";
import LunchDeciderApp from "../Lunch Decider App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LunchDeciderApp />
  </React.StrictMode>
);
