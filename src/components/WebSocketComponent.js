import React, { useState } from 'react';
import "./WebSocketComponent.css"

function WebSocketComponent() {
  const [serverAddress, setServerAddress] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [websocket, setWebSocket] = useState(null);



  const handleServerAddressChange = (event) => {
    setServerAddress(event.target.value);
  };

  const connectWebSocket = () => {
    if (serverAddress) {
      console.log(">> " + serverAddress)
      const ws = new WebSocket(serverAddress);

      ws.onopen = () => {
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
      console.log(">> ", data)
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
      <div>
        {connected ? (
          <div>
            <input readOnly={true} className="terminal" onKeyDown={sendMessage} value={messages}/>
          </div>
        ) : (
          <div>WebSocket에 연결되지 않았습니다.</div>
        )}
      </div>
    </div>
  );
}

export default WebSocketComponent;
