import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

import { FronteggProvider } from "@frontegg/react";

const contextOptions = {
  baseUrl: "https://app-06gp7oj9w689.frontegg.com",
};

ReactDOM.render(
  <FronteggProvider contextOptions={contextOptions}>
    <App />
  </FronteggProvider>,
  document.getElementById("root")
);
