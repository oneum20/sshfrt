import React, { useEffect, useRef } from 'react';
import Modal from './Modal';
import Tab from "./Tabs";
import Split from 'react-split';
import FileTree from './FileTree';
import { useTerminal } from '../hooks/useTerminal';
import "./App.css";
 
function App() {
    const { isModalOpen, handleOpenModal, handleCloseModal, handleSaveItem, items, tabFocus, handleItemResize, handleCloseTab, terminalsRef} = useTerminal();
    const tabFocusRef = useRef(tabFocus);


    useEffect(() => {
        tabFocusRef.current = tabFocus;
    }, [tabFocus]);

    const handleSplitDragEnd = () => {
        handleItemResize(tabFocusRef.current);        
    };

    return (
        
        <div className="app-container">
            
            {isModalOpen && <Modal onClose={handleCloseModal} onSave={handleSaveItem} />}
            <Split
                className="main-split"
                sizes={[15, 85]} // 사이드바와 메인 컨텐츠의 비율
                direction="horizontal"
                style={{ display: 'flex', height: '100vh', width: '100%' }}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                gutter={() => {
                    const gutterElement = document.createElement('div');
                    gutterElement.className = `gutter gutter-vertical`;
                    return gutterElement;
                }}
                onDragEnd={handleSplitDragEnd}
            >
                <nav className="sidebar">
                    <button onClick={handleOpenModal}>+ 추가</button>
                    <FileTree terminalsRef={terminalsRef}/>
                </nav>
                <Split
                    className="main-content"
                    sizes={[70, 30]}
                    direction="vertical"
                    style={{ display: 'flex', height: '100%', width: '100%' }}
                    gutterSize={10}
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    gutter={() => {
                        const gutterElement = document.createElement('div');
                        gutterElement.className = `gutter gutter-horizontal`;
                        return gutterElement;
                    }}
                    onDragEnd={handleSplitDragEnd}
                >
                    <div className="editor">
                        {/* 에디터 콘텐츠 추가 */}
                    </div>
                    <div className="terminal">
                        <Tab contents={items} onCloseTab={handleCloseTab} focus={tabFocus} />
                    </div>
                </Split>
            </Split>
        </div>
    );
}

export default App;