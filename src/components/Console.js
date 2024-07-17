import React, {useEffect, useRef, useState } from 'react';
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./Console.css";
import { useTerminal } from '../hooks/useTerminal';
import { eventManager } from '../utils/EventManager';

function Console({uid, wsServerAddress, sshServerConfig, terminalsRef, id}) {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const websocketRef = useRef(null);
  const fitAddon = new FitAddon();
  const { handleItemStateChange, handleFileTree } = useTerminal();
  const [isMounted, setIsMounted] = useState(false);
  const [terminalState, setTerminalState] = useState(null);

  useEffect(()=>{
    if(terminalState && terminalState === `${uid}-ready`){
      handleFileTree(uid, null);
    }
  }, [terminalState]);
  

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
        setTerminalState(curState);
        handleItemStateChange(curState);             
      };

      ws.onmessage = (event) => {
        const rcvMsg = JSON.parse(event.data);
        const decodedData = atob(rcvMsg.data);
        

        if (terminalRef.current.state === `${uid}-new`) {
          let curState = `${uid}-ready`;
          terminalRef.current.state = curState;
          setTerminalState(curState);
        }
        
        switch (rcvMsg.action) {
          case 'terminal':
            terminal.write(decodedData);
            break;
          case 'getfiles': {
            let data = JSON.parse(decodedData);
            if(terminalsRef.current[uid][3] == undefined){
              terminalsRef.current[uid][3] = [{
                name: data.parent,
                isDir: true,
                files: []
              }];
            }

            if(!data.fileTree){
              data.fileTree = [];
            }

            addItemsToDirectory(terminalsRef.current[uid][3], data, terminalsRef.current[uid][3][0].name);
            
            eventManager.emit('fileTreeUpdate', { uid, terminalsRef });
            break;
          }
          default:
            console.warn('Unknown action :', rcvMsg.action);
        }
      };

      ws.onclose = () => {        
        let curState = `${uid}-close`;

        terminalRef.current.state = curState;
        setTerminalState(curState);
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

    const addItemsToDirectory = (targetFileTree, inputFileTree, root) => {
      const findAndAdd = (currentItems, pathParts) => {
        for (let item of currentItems) {
          if (item.isDir && item.name === pathParts[0]) {
            if (pathParts.length === 1) {
              item.files = [];
              item.files = [...item.files, ...inputFileTree.fileTree];
              return true;
            }
            return findAndAdd(item.files, pathParts.slice(1));
          }
        }
        return false;
      };
    
      const pathParts = [root, ...inputFileTree.parent.replace(root,"").split('/').filter(part => part)];
      findAndAdd(targetFileTree, pathParts);
    };

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
