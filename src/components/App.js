import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Tab from "./Tabs"
import Console from "./Console"
import Split from 'react-split';
import "./App.css"

function App() {
    const [idCounter, setIdCounter] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const terminalsRef = useRef({});

    useEffect(() => {
        // 로컬 스토리지에서 저장된 터미널 상태 복원
        const savedItems = JSON.parse(localStorage.getItem('terminals')) || [];
        if (savedItems.length > 0) {
            const restoredItems = savedItems.map(item => ({
                ...item,
                content: createConsole(item.key, item.sshServerConfig, item.wsServerAddress)
            }));
            
            setItems(restoredItems)
            setIdCounter(Math.max(...savedItems.map(item => item.key)));
        }
    }, []);

    useEffect(() => {
        // 터미널 상태를 로컬 스토리지에 저장
        const terminalsToSave = items.map(({ key, name, sshServerConfig, wsServerAddress }) => ({
            key,
            name,
            sshServerConfig,
            wsServerAddress
        }));
        localStorage.setItem('terminals', JSON.stringify(terminalsToSave));
    }, [items]);

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

    const createConsole = (key, sshServerConfig, wsServerAddress) => (
        <Console
            uid={key}
            sshServerConfig={sshServerConfig}
            wsServerAddress={wsServerAddress}
            id={`xterm-container-${key}`}
            onStateChange={handleItemStateChange}
            terminalsRef={terminalsRef}
        />
    );

    const handleSaveItem = (item) => {
        const gendKey = generateId();
        const terminal = {
            key: gendKey,
            name: item[0].host,
            sshServerConfig: item[0],
            wsServerAddress: item[1],
            content: createConsole(gendKey, item[0], item[1])
        };
        setItems(prevItems => [...prevItems, terminal]);
        setIdCounter(gendKey);
    };

    const handleItemStateChange = (state) => {
        const arr = state.split('-');
        const key = parseInt(arr[0]);
        const value = arr[1];

        if (value === "close") {
            if (terminalsRef.current[key]) {
                terminalsRef.current[key].dispose();
                delete terminalsRef.current[key];
            }


            setItems(prevItems => {
                const newItems = prevItems.filter(item => item.key !== key);
                return newItems;
            });
        }
    };

    const handleCloseTab = (key) => {
        handleItemStateChange(`${key}-close`);
    }

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
                    <Tab contents={items} onCloseTab={handleCloseTab}/>
                </div>
            </Split>
        </div>
    );
}

export default App;