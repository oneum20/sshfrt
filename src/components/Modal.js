import React, { useState } from 'react';
import "./Modal.css";

function Modal({ onClose, onSave }) {
    const [SshServerConfig, setSshServerConfig] = useState({action: "connection"});
    const [wsServerAddress, setWsServerAddress] = useState('ws://localhost:8080/ws');


  const handleWsServerAddressChange = (event) => {
    setWsServerAddress(event.target.value);
  };

  const handleSshConfigChange = (event) => {
    const key = event.target.id;
    let data = {};

    switch(key){
      case "ssh-host":
        data = {host: event.target.value};
        break;
      case "ssh-port":
        data = {port: event.target.value};
        break;
      case "ssh-user":
        data = {username: event.target.value};
        break;
      case "ssh-pass":
        data = {password: event.target.value};
        break;
      default:
        break;
    }
    setSshServerConfig(Object.assign({}, SshServerConfig, data));
  };

  const handleSubmit = () => {
    onSave([SshServerConfig, wsServerAddress]);
    onClose();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className='modal'>
        <h1>SSH Bridge</h1>
        <div className='container'>
            <div className='row'>
                <label>
                    SSH Server Host:
                    <input id="ssh-host" type="text" value={SshServerConfig.host || ""} onChange={handleSshConfigChange} />
                </label>
            </div>
            <div className='row'>
                <label>
                    SSH Server Port:
                    <input id="ssh-port" type="text" value={SshServerConfig.port || ""} onChange={handleSshConfigChange} />
                </label>
            </div>
            <div className='row'>
                <label>
                    SSH Server Username:
                    <input id="ssh-user" type="text" value={SshServerConfig.username || ""} onChange={handleSshConfigChange} />
                </label>
            </div>
            <div className='row'>
                <label>
                    SSH Server Password:
                    <input id="ssh-pass" type="password" value={SshServerConfig.password || ""} onChange={handleSshConfigChange} />
                </label>
            </div>
            <div className='row'>
                <label>
                    WebSocket Server Address:
                    <input type="text" value={wsServerAddress} onChange={handleWsServerAddressChange} />
                </label>
            </div>
        </div>
        <div className='buttons'>
            <button onClick={handleSubmit}>확인</button>
            <button onClick={onClose}>취소</button>
        </div>
    </div>
  </>
  );
}

export default Modal;