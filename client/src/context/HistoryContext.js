//Wrapping up the entire application so that every component can have access to our state
import React, { useState, createContext } from 'react';

export const HistoryContext = createContext();

export const HistoryContextProvider = (props) => {
    const [history, setHistory] = useState([]);

    return (
        <HistoryContext.Provider value={{history, setHistory}}>
            {props.children}
        </HistoryContext.Provider>
    );
}