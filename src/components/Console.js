import React, {useEffect, useRef, useState } from 'react';
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./Console.css";
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

      fitAddon.fit();      
      terminalRef.current = terminal;

      

      // Websocket 연결 처리
      const ws = new WebSocket(wsServerAddress);

      ws.onopen = () => {        
        let curState = `${uid}-new`;
        let terminalMessage = {
          action: "terminal",
          data: `Connecting to ${wsServerAddress}`
        };

        terminal.writeln(terminalMessage);

        // TODO:  cols, rows 전달이 안될 때가 있음. 확인 필요
        let data = Object.assign({}, sshServerConfig, {cols: terminal.cols, rows: terminal.rows});
        ws.send(JSON.stringify(data));

        terminalRef.current.state = curState;
        handleItemStateChange(curState);        
      };

      ws.onmessage = (event) => {
        const rcvMsg = JSON.parse(event.data);
        const decodedData = atob(rcvMsg.data);
        

        if (terminalRef.current.state === `${uid}-new`) {
          let curState = `${uid}-ready`;
          terminalRef.current.state = curState;
        }
        
        switch (rcvMsg.action) {
          case 'terminal':
            terminal.write(decodedData);
            break;
          default:
            console.warn('Unknown action :', rcvMsg.action);
        }
      };

      ws.onclose = () => {        
        let curState = `${uid}-close`;

        terminalRef.current.state = curState;
        handleItemStateChange(curState);
      };

      ws.onerror = (event) => {
        terminal.writeln(event);
      };

      terminal.onResize(({cols, rows}) => {
        let data = {action: "resize", cols: cols, rows: rows};

        ws.send(JSON.stringify(data));
      });

      terminal.onData(data => {
        ws.send(JSON.stringify({action: 'terminal', data: data}));
      });

      websocketRef.current = ws;      


      terminalsRef.current[uid] = [terminal, fitAddon, ws];


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

  }, [id, wsServerAddress, uid, sshServerConfig, isMounted]);

  return (
    <div style={{height: '100%', overflow: "hidden"}}>
      <div  id={id} ref={containerRef}  style={{ width: '100%', height: '100%', overflow: "hidden"}}></div>
    </div>
    
  );
}

export default Console;
