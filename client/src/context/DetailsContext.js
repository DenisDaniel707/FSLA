//Wrapping up the entire application so that every component can have access to our state
import React, { useState, createContext } from 'react';

export const DetailsContext = createContext();

export const DetailsContextProvider = (props) => {
    const [details, setDetails] = useState([]);

    return (
        <DetailsContext.Provider value={{details, setDetails}}>
            {props.children}
        </DetailsContext.Provider>
    );
}