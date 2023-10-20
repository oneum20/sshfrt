import React, { useState, useEffect } from 'react';
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "./WebSocketComponent.css"
require("xterm/css/xterm.css")

function WebSocketComponent() {
  const [serverAddress, setServerAddress] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [websocket, setWebSocket] = useState(null);
  const [terminal, setTerminal] = useState(null);
  const [configured, setConfigured] = useState(false)


  useEffect(() => {
    if(!terminal){
      const term = new Terminal();
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(document.getElementById("xterm-container"));
      
      
      term.writeln("Hello web terminal");

      setTerminal(term);
    }

    if(websocket && !configured){
      terminal.onData((e)=>{
        terminal.write(e);
      });

      setConfigured(true)
    }    
  })



  const handleServerAddressChange = (event) => {
    setServerAddress(event.target.value);
  };

  const connectWebSocket = () => {
    if (serverAddress) {
      console.log(">> " + serverAddress)
      const ws = new WebSocket(serverAddress);

      ws.onopen = () => {
        terminal.writeln("Connected to " + serverAddress)
        setConnected(true);
        setWebSocket(ws);
      };

      ws.onmessage = (event) => {
        const message = event.data;
        setMessages(message);
      };

      ws.onclose = () => {
        setConnected(false);
      };
    }
  };

  const sendMessage = (message) => {
    if (websocket && connected) {
      let data = message.key.charCodeAt(0)
      websocket.send(data);
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
