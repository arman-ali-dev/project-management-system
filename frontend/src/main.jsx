import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store.js";
import persistStore from "redux-persist/es/persistStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

let persistor = persistStore( store );

window.global = window;

createRoot( document.getElementById( "root" ) ).render(
  <BrowserRouter>
    <Provider store={ store }>
      <PersistGate loading={ null } persistor={ persistor }>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
);
