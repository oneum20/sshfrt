import React, { useState, useEffect } from 'react';
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from "xterm-addon-attach"
import "./Console.css"
import "xterm/css/xterm.css"

function Console(props) {
  const [terminal, setTerminal] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const fitAddon = new FitAddon();
  

  useEffect(() => {

    if(!terminal && !websocket){
      const terminal = new Terminal();
      terminal.loadAddon(fitAddon);

      // 로그 레벨 설정
      // terminal.options.logLevel = "trace";
      
      terminal.open(document.getElementById(props.id));
      terminal.writeln("Hello web terminal");

      fitAddon.fit();
      setTerminal(terminal);



      // Websocket 연결 처리
      const ws = new WebSocket(props.wsServerAddress);
      const attachAddon = new AttachAddon(ws);
      terminal.loadAddon(attachAddon);



      ws.onopen = () => {
        let curState = props.uid + "-new";
        terminal.writeln("Connecting to " + props.wsServerAddress);
        // TODO:  cols, rows 전달이 안될 때가 있음. 확인 필요
        let data = Object.assign({}, props.sshServerConfig, {cols: terminal.cols, rows: terminal.rows});
        ws.send(JSON.stringify(data));

        
        props.onStateChange(curState);
        
      };

      ws.onclose = () => {
        let curState = props.uid + "-close";
        console.log("Connection Closed!!!");
        terminal.writeln("\n\rwebsocket connection closed");

        props.onStateChange(curState);
      };

      ws.onerror = (event) => {
        terminal.writeln(event);
      };

      setWebsocket(ws);
    }
  });

  

  return (
    <div>
      <div id={props.id}></div>
    </div>
    
  );
}

export default Console;
