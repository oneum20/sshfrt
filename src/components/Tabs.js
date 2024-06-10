import React, { useEffect, useState } from 'react';
import './Tabs.css';

function Tabs(props){
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const focus = props.contents.length <= 0? null : props.contents[props.contents.length - 1].key;
    setActiveTab(focus);
  }, [props.contents.length]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTabClose = (key, event) => {
    event.stopPropagation(); // 이벤트 버블링을 막아 탭 클릭 이벤트가 발생하지 않도록 함
    props.onCloseTab(key);
  };

  return (
    <div className="tabs-container">
      {/* 탭 버튼 */}
      <div className="tab-buttons">
        {props.contents.map((item) => (
          <div key={`btn-${item.key}`} className="tab-button-container">
            <button 
              className={`tab-button ${item.key === activeTab ? 'active' : ''}`}
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
        {props.contents.map((item) => (
          <div 
            key={`console-${item.key}`} 
            className={`tab-pane ${item.key === Number(activeTab) ? 'active' : ''}`}
          >
            {item.content}
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default Tabs;
