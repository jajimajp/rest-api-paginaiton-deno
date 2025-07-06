import React from "https://esm.sh/react@19";
import { createRoot } from "https://esm.sh/react-dom@19/client";
import { App } from "./App.tsx";

createRoot(document.getElementById("app"))
  .render(
    <>
      <App />
    </>,
  );
