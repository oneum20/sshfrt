import React, {useEffect, useState} from 'react';
import { eventManager } from '../utils/EventManager';
import { useTerminal } from '../hooks/useTerminal';
import "./FileTree.css";

function FileTree() {
    const {handleFileTree, tabFocus, terminalsRef} = useTerminal();
    const [fileTree, setFileTree] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});

    useEffect(() => {
        const handleTerminalReady = (event) => {            
            const { uid } = event;
            if (terminalsRef.current[uid] && terminalsRef.current[uid].length > 3) {
                const newFileTree = [...terminalsRef.current[uid][3]];
                setFileTree(newFileTree);
            }else{
                setFileTree([]);
            }
        };
        
        eventManager.on('fileTreeUpdate', handleTerminalReady);
    
        return () => {
            eventManager.off('fileTreeUpdate', handleTerminalReady);
        };
    }, [terminalsRef]);

    const handleExpand = async  (path) => {
        const newExpandedNodes = { ...expandedNodes, [path]: !expandedNodes[path] };
        setExpandedNodes(newExpandedNodes);

        if (!expandedNodes[path]) {
            await handleFileTree(tabFocus, path);
        }
    };

    const renderTree = (items, parentPath = '') => {
        return items.map((item) => {
            const fullPath = `${parentPath}/${item.name}`;
            return (
                <li key={fullPath} className="tree-item">
                    {item.isDir ? (
                        <>
                            <span onClick={() => handleExpand(fullPath)} className="tree-folder">
                                {expandedNodes[fullPath] ? '-' : '+'} {item.name}
                            </span>
                            {expandedNodes[fullPath] && item.files && (
                                <ul>{renderTree(item.files, fullPath)}</ul>
                            )}
                        </>
                    ) : (
                        <span className="tree-file">{item.name}</span>
                    )}
                </li>
            );
        });
    };

    return (
        <div className="file-tree">
            <ul>{renderTree(fileTree)}</ul>
        </div>
    );
}

export default FileTree;