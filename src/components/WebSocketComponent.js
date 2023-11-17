import React, { useState, useEffect } from 'react';
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from "xterm-addon-attach"
import "./WebSocketComponent.css"
import "xterm/css/xterm.css"

function WebSocketComponent() {
  const [wsServerAddress, setWsServerAddress] = useState('');
  const [sshServer, setSshServer] = useState({action: "connection"});
  const [terminal, setTerminal] = useState(null);
  const fitAddon = new FitAddon();
  

  useEffect(() => {
    if(!terminal){
      const terminal = new Terminal()
      terminal.loadAddon(fitAddon);
      
      terminal.open(document.getElementById("xterm-container"));
      terminal.writeln("Hello web terminal");

      fitAddon.fit();
      setTerminal(terminal)
    }
    
  })

  const handleSshConfigChange = (event) => {
    const key = event.target.id;
    let data = {};

    switch(key){
      case "ssh-host":
        data = {host: event.target.value}
        break;
      case "ssh-port":
        data = {port: event.target.value}
        break;
      case "ssh-user":
        data = {username: event.target.value}
        break;
      case "ssh-pass":
        data = {password: event.target.value}
        break;
      default:
        break;
    }
    setSshServer(Object.assign({}, sshServer, data));
  }


  const handleWsServerAddressChange = (event) => {
    setWsServerAddress(event.target.value);
  };

  const connectWebSocket = () => {
    if (wsServerAddress) {
      const ws = new WebSocket(wsServerAddress);
      const attachAddon = new AttachAddon(ws)
      terminal.loadAddon(attachAddon)



      ws.onopen = () => {
        terminal.writeln("Connecting to " + wsServerAddress)
        
        setSshServer(Object.assign({}, sshServer, {cols: terminal.cols, rows: terminal.rows}))
        ws.send(JSON.stringify(sshServer))
      };

      ws.onclose = () => {
        terminal.writeln("\n\rwebsocket connection closed")
      };

      ws.onerror = (event) => {
        terminal.writeln(event)
      }
    }
  };

  return (
    <div>
      <h1>SSH Bridge</h1>
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <label>
              SSH Server Host: 
              <input id="ssh-host" type="text" value={sshServer.host || ""} onChange={handleSshConfigChange} />
            </label>      
          </div>
          <div className='col'>
            <label>
              SSH Server Port: 
              <input id="ssh-port" type="text" value={sshServer.port || ""} onChange={handleSshConfigChange} />
            </label>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <label>
              SSH Server Username: 
              <input id="ssh-user" type="text" value={sshServer.username || ""} onChange={handleSshConfigChange} />
            </label>
          </div>
          <div className='col'>
            <label>
              SSH Server User Password: 
              <input id="ssh-pass" type="password" value={sshServer.password || ""} onChange={handleSshConfigChange} />
          </label>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>
              WebSocket Server Address:
              <input type="text" value={wsServerAddress} onChange={handleWsServerAddressChange} />
            </label>
          </div>
        </div>
        <button onClick={connectWebSocket}>연결</button>

      </div>
      <div id="xterm-container"></div>
    </div>
    
  );
}

export default WebSocketComponent;
