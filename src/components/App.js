import React, { useState } from 'react';
import Modal from './Modal';
import Tab from "./Tabs"
import Console from "./Console"
import Split from 'react-split';
import "./App.css"

function App() {
    const [idCounter, setIdCounter] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);

    const generateId = () => {
        let id = idCounter + 1;
        setIdCounter(id);
        return id;
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveItem = (item) => {
        let gendKey = generateId();
        const terminal = {
            key: gendKey,
            name: item[0].host,
            content: (
                <Console 
                    uid={gendKey} 
                    sshServerConfig={item[0]} 
                    wsServerAddress={item[1]} 
                    id={`xterm-container-${gendKey}`} 
                    onStateChange={handleItemStateChange}
                />
            )
        };
        console.log(terminal)
        setItems([...items, terminal]);
    };

    const handleItemStateChange = (state) => {
        const arr = state.split('-');
        const key = arr[0];
        const value = arr[1];
        
        if (value === "close"){
            const newItems = items.filter(item => item.key !== key);
            setItems(newItems);
        }
    };

    return (
        
        <div className="app-container">
            <nav className="sidebar">
            <   button onClick={handleOpenModal}>+ 추가</button>
                {/* 네비게이션 바 콘텐츠 추가 */}
            </nav>
            {isModalOpen && <Modal onClose={handleCloseModal} onSave={handleSaveItem} />}
            <Split 
                className="main-content"
                sizes={[70, 30]}
                direction="vertical"
                style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}     
                gutter={(index, direction) => {
                    const gutterElement = document.createElement('div');
                    gutterElement.className = `gutter gutter-horizontal`;
                    return gutterElement;
                }}       
            >
                <div className="editor">
                </div>
                <div className="terminal">
                    <Tab contents={items} focus={items.length - 1}  />
                </div>
            </Split>
        </div>
    );
}

export default App;