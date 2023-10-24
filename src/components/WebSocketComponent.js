import React, { useState, useEffect } from 'react';
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from "xterm-addon-attach"
import "./WebSocketComponent.css"
import "xterm/css/xterm.css"

function WebSocketComponent() {
  const [serverAddress, setServerAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [websocket, setWebSocket] = useState(null);
  const [terminal, setTerminal] = useState(null);
  const fitAddon = new FitAddon();

  useEffect(() => {
    if(!terminal){
      const term = new Terminal({});
      
      term.loadAddon(fitAddon);
      term.open(document.getElementById("xterm-container"));
      fitAddon.fit()
      term.writeln("Hello web terminal");

      setTerminal(term);
    }
  })



  const handleServerAddressChange = (event) => {
    setServerAddress(event.target.value);
  };

  const connectWebSocket = () => {
    if (serverAddress) {
      const ws = new WebSocket(serverAddress);
      const attachAddon = new AttachAddon(ws)
      terminal.loadAddon(attachAddon)

      ws.onopen = () => {
        terminal.writeln("Connected to " + serverAddress)
        setWebSocket(ws);
      };

      ws.onclose = () => {
        setConnected(false);
      };
    }
  };

  return (
    <div>
      <h1>SSH Bridge</h1>
      <div>
        <label>
          WebSocket 서버 주소:
          <input type="text" value={serverAddress} onChange={handleServerAddressChange} />
        </label>
        <button onClick={connectWebSocket}>연결</button>
      </div>

      <div id="xterm-container"></div>
    </div>
    
  );
}

export default WebSocketComponent;
