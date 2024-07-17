import { useContext } from "react";
import {TerminalContext} from "../context/TerminalContext";

const useTerminal = () => {
    return useContext(TerminalContext);
};

export { useTerminal };