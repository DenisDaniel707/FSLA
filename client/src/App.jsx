//Main App - This will wrap the entire application
import React from 'react';
import '../node_modules/antd/dist/antd.css';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './routes/Home';
import View from './routes/View';
import { RecordsContextProvider } from './context/RecordsContext';
import { DetailsContextProvider } from './context/DetailsContext';
import { HistoryContextProvider } from './context/HistoryContext';

//Route handler
//The switch tag is there to tell the router not to look for another route when it matched it
//(prevent ReactRouter to load multiple components all at once)
const App = () => {
    return (
        <RecordsContextProvider>
        <DetailsContextProvider>
        <HistoryContextProvider>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/records/:id/view" component={View} />
                    </Switch>
                </Router>
            </div>
        </HistoryContextProvider>
        </DetailsContextProvider>
        </RecordsContextProvider>
    );
}

export default App;