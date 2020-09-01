//Wrapping up the entire application so that every component can have access to our state
import React, { useState, createContext } from 'react';

export const RecordsContext = createContext();

export const RecordsContextProvider = (props) => {
    const [records, setRecords] = useState([]);

    return (
        <RecordsContext.Provider value={{records, setRecords}}>
            {props.children}
        </RecordsContext.Provider>
    );
}