import React, { useEffect } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { eventManager } from '../utils/EventManager';
import './Tabs.css';

function Tabs({contents, onCloseTab, focus}){
  const {tabFocus, setTabFocus, handleItemResize, terminalsRef} = useTerminal();

  useEffect(() => {
    setTabFocus(tabFocus !== null ? tabFocus : contents.length > 0 ? contents[contents.length - 1].key : null);
  }, [contents.length, focus, setTabFocus]);

  useEffect(() => {
    let uid = tabFocus;
    
    handleItemResize(uid);
    eventManager.emit('fileTreeUpdate', { uid, terminalsRef });
  }, [tabFocus]);

  const handleTabClick = (tab) => {
    setTabFocus(tab);
  };

  const handleTabClose = (key, event) => {
    event.stopPropagation();
    onCloseTab(key);
  };

  return (
    <div className="tabs-container">
      {/* 탭 버튼 */}
      <div className="tab-buttons">
        {contents.map((item) => (
          <div key={`btn-${item.key}`} className="tab-button-container">
            <button 
              className={`tab-button ${item.key === tabFocus ? 'active' : ''}`}
              onClick={() => handleTabClick(item.key)}
            >
              <span className="tab-button-text">{item.name}</span>
            </button>
            <button 
              className="close-button" 
              onClick={(event) => handleTabClose(item.key, event)}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="tab-content">
        {contents.map((item) => (
          <div 
            key={`console-${item.key}`} 
            className={`tab-pane ${item.key === Number(tabFocus) ? 'active' : ''}`}
          >
            {item.content}
          </div>
        ))
        }
      </div>
    </div>
  );
}

export default Tabs;
