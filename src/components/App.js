import React from 'react';
import Modal from './Modal';
import Tab from "./Tabs";
import Split from 'react-split';
import { useTerminal } from '../hooks/userTerminal';
import "./App.css";
 
function App() {
    const { isModalOpen, handleOpenModal, handleCloseModal, handleSaveItem, items, handleCloseTab, tabFocus} = useTerminal();

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
                gutter={() => {
                    const gutterElement = document.createElement('div');
                    gutterElement.className = `gutter gutter-horizontal`;
                    return gutterElement;
                }}       
            >
                <div className="editor">
                </div>
                <div className="terminal">
                    <Tab contents={items} onCloseTab={handleCloseTab} focus={tabFocus}/>
                </div>
            </Split>
        </div>
    );
}

export default App;