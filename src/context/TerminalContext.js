import React, {createContext, useState, useRef, useEffect} from 'react';
import Console from '../components/Console';
import { eventManager } from '../utils/EventManager';

const TerminalContext = createContext();

const TerminalProvider = ({children}) => {
    const [idCounter, setIdCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [tabFocus, setTabFocus] = useState(null);
    const terminalsRef = useRef({}); 

    useEffect(() => {
        // 로컬 스토리지에서 저장된 터미널 상태 복원
        const savedItems = JSON.parse(localStorage.getItem('terminals')) || [];
        if (savedItems.length > 0) {
            const restoredItems = savedItems.map(item => ({
                ...item,
                content: createConsole(item.key, item.sshServerConfig, item.wsServerAddress)
            }));
            
            setItems(restoredItems);
            setIdCounter(Math.max(...savedItems.map(item => item.key)));
        }
        // eslint-disable-next-line 
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
            name: `${item[0].username}@${item[0].host}:${item[0].port}`,
            sshServerConfig: item[0],
            wsServerAddress: item[1],
            content: createConsole(gendKey, item[0], item[1])
        };
        setItems(prevItems => [...prevItems, terminal]);
        setIdCounter(gendKey);

        setTabFocus(gendKey);
    };

    const handleFileTree = (focus, root) => {
        const terminal = terminalsRef.current[focus];
        let data = JSON.stringify({
            action: "getfiles", 
            root: root === null ? "HOME_DIR" : root
        });

        if (focus !== null && terminal[0].state === `${focus}-ready`) terminal[2].send(data);
    };

    const handleItemResize = (focus)  => {
        const terminal = terminalsRef.current[focus];
        
        if (focus !== null && terminal && terminal[0].state === `${focus}-ready`) terminal[1].fit();
    };

    const handleItemStateChange = (state) => {
        const arr = state.split('-');
        const key = parseInt(arr[0]);
        const value = arr[1];
        const idx = items.findIndex((i) => i.key === key);

        if (value === "close") {
            if (terminalsRef.current[key]) {
                terminalsRef.current[key][0].dispose();
                delete terminalsRef.current[key];
            }

            setItems(prevItems => {
                const newItems = prevItems.filter(item => item.key !== key);
                let nextTabFocus = null;
                if (newItems.length <= 0){
                    nextTabFocus = null;
                } else if (idx >= newItems.length){
                    nextTabFocus = newItems[idx - 1].key;
                } else {
                    nextTabFocus = newItems[idx].key;
                }

                eventManager.emit('fileTreeUpdate', { nextTabFocus });
                return newItems;
            });

            
            
        }
    };

    const handleCloseTab = (key) => {
        handleItemStateChange(`${key}-close`);
    };

    return (
        <TerminalContext.Provider
            value={{
                isModalOpen,
                handleOpenModal, 
                handleCloseModal,
                items,
                handleSaveItem,
                handleItemResize,
                handleItemStateChange,
                handleCloseTab,
                tabFocus,
                setTabFocus,
                handleFileTree,
                terminalsRef
            }}
        >
            {children}
        </TerminalContext.Provider>
    );
};

export { TerminalContext, TerminalProvider };