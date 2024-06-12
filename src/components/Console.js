import React, {useEffect, useRef, useState } from 'react';
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import "./Console.css";
import "xterm/css/xterm.css";
import { useTerminal } from '../hooks/userTerminal';

function Console({uid, wsServerAddress, sshServerConfig, terminalsRef, id}) {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const websocketRef = useRef(null);
  const fitAddon = new FitAddon();
  const { handleItemStateChange } = useTerminal();
  const [isMounted, setIsMounted] = useState(false);
  

  useEffect(() => {
    if(terminalRef.current == null){
      const terminal = new Terminal();
      terminal.loadAddon(fitAddon);

      // xtermjs 로그 레벨 설정
      // terminal.options.logLevel = "trace";
      
      terminal.open(containerRef.current);
      terminal.writeln("Hello web terminal");

      fitAddon.fit();
      terminalsRef.current[uid] = terminal;
      terminalRef.current = terminal;



      // Websocket 연결 처리
      const ws = new WebSocket(wsServerAddress);
      const attachAddon = new AttachAddon(ws);
      terminal.loadAddon(attachAddon);



      ws.onopen = () => {        
        let curState = `${uid}-new`;
        terminal.writeln("Connecting to " + wsServerAddress);
        // TODO:  cols, rows 전달이 안될 때가 있음. 확인 필요
        let data = Object.assign({}, sshServerConfig, {cols: terminal.cols, rows: terminal.rows});
        ws.send(JSON.stringify(data));

        
        handleItemStateChange(curState);
        
      };

      ws.onclose = () => {        
        let curState = `${uid}-close`;

        handleItemStateChange(curState);
      };

      ws.onerror = (event) => {
        terminal.writeln(event);
      };

      websocketRef.current = ws;


      setIsMounted(true);
    }    

    // Cleanup function
    return () => {
      if (isMounted){
        if (terminalRef.current) {
          terminalRef.current.dispose();
        }
        if (websocketRef.current) {
          websocketRef.current.close();
        }
      }      
    };

  }, [id, wsServerAddress, uid, sshServerConfig]);

  return (
    <div>
      <div id={id} ref={containerRef}></div>
    </div>
    
  );
}

export default Console;
