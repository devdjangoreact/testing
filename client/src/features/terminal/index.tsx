import React, { Component, useEffect, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
// import { getToken } from "@libs/auth";
import { FitAddon } from "xterm-addon-fit";

const websocket = new WebSocket("ws://192.168.17.131:8000/ws/shell/");

const Term = () => {
  const [connect, setconnect] = useState(true);

  const myFunction = () => {
    setconnect(!connect);
    connect ? window.location.reload() : websocket.send("disconnect");
    console.log(connect);
  };

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true });

    term.open(document.getElementById("terminal"));
    term.focus();
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    term.onKey((e) => {
      websocket.send(e.key);
      term.focus();

      console.log(1, "print", e.key);
    });

    websocket.onopen = function (evt) {
      console.log(evt);
      websocket.send("");
    };

    websocket.onclose = function (evt) {
      console.log("onclose");
    };
    websocket.onmessage = async function (evt) {
      console.log(evt);
      term.write(evt.data);
    };
    websocket.onerror = function (evt) {
      console.log(evt);
    };
  }, []);

  return (
    <div className="h-full">
      <div className="bg-white  p-2">
        <span>Status: </span>
        <button
          className="bg-orange-50 px-2 rounded-lg"
          id="button"
          onClick={myFunction}
        >
          {connect ? "connect" : "disconnect"}
        </button>
      </div>

      <div className="container-children w-full h-screen ">
        <div id="terminal" className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default Term;
