import React, { useEffect, useState } from 'react';
import './Tabs.css';

function Tabs (props) {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setActiveTab(props.contents.length - 1);
  }, [props.contents.length])

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs-container">
      {/* 탭 버튼 */}
      <div className="tab-buttons">
        {props.contents.map((item, index) => (
          (
            <button 
              key={`btn-${index}`} 
              className={`tab-button ${index === activeTab ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {item.name}
            </button>
          )
        ))
        }
      </div>
      
      {/* 탭 내용 */}
      <div className="tab-content">
        {props.contents.map((item, index) => (
          <div 
            key={`console-${index}`} 
            className={`tab-pane ${index === Number(activeTab) ? 'active' : ''}`}
            // style={{display: index === Number(activeTab) ? 'block' : 'none'}}
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
