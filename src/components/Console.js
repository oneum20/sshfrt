import React, {useEffect, useRef } from 'react';
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from "xterm-addon-attach"
import "./Console.css"
import "xterm/css/xterm.css"

function Console(props) {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const websocketRef = useRef(null);
  const fitAddon = new FitAddon();
  

  useEffect(() => {
    if(terminalRef.current == null){
      const terminal = new Terminal();
      terminal.loadAddon(fitAddon);

      // 로그 레벨 설정
      // terminal.options.logLevel = "trace";
      
      terminal.open(containerRef.current)
      terminal.writeln("Hello web terminal");

      fitAddon.fit();
      props.terminalsRef.current[props.uid] = terminal;
      terminalRef.current = terminal;



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

        props.onStateChange(curState);
      };

      ws.onerror = (event) => {
        terminal.writeln(event);
      };

      websocketRef.current = ws;

    }    

    // Cleanup function
    return () => {
      if (terminalRef.current) {
        terminalRef.current.dispose();
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };

  }, [props.id, props.wsServerAddress, props.uid, props.sshServerConfig, props.onStateChange, props.terminalsRef]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <div id={props.id} ref={containerRef}></div>
    </div>
    
  );
}

export default Console;
