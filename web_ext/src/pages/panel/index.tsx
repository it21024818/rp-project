import React from "react";
import { createRoot } from "react-dom/client";
import AppPannel from "@pages/panel/AppPannel";
import "@pages/panel/index.css";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Panel root element");
  const root = createRoot(rootContainer);
  root.render(<AppPannel />);
}

export default init();
