import React, { useEffect, useState } from 'react';
import './Tabs.css';

function Tabs({contents, onCloseTab, focus}){
  const [activeTab, setActiveTab] = useState(null);


  useEffect(() => {
    setActiveTab(focus !== null ? focus : contents.length > 0 ? contents[contents.length - 1].key : null);
  }, [contents.length, focus]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
        {contents.map((item) => (
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
