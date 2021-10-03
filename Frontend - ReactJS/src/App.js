import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './views/Home';
import Power from './views/Power';
import Visualizer from './views/Visualizer';
import GetData from './views/GetData';
import GetLocation from './views/GetLocation';
import GetPerformance from './views/GetPerformance';
import Feasiblity from './views/Feasiblity';
import ComparisonSimple from './views/ComparisonSimple';
import Get1Year from './views/Get1Year';
import Analysis from './views/Analysis';
import Team from './views/Team';

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
                <Switch>
                    <Route exact path="/get-data" component={GetData} />
                </Switch>
                <Switch>
                    <Route exact path="/power" component={Power} />
                </Switch>
                <Switch>
                    <Route exact path="/visualizer" component={Visualizer} />
                </Switch>
                <Switch>
                    <Route exact path="/get-location" component={GetLocation} />
                </Switch>
                <Switch>
                    <Route exact path="/feasiblity" component={Feasiblity} />
                </Switch>
                <Switch>
                    <Route exact path="/get-performance" component={GetPerformance} />
                </Switch>
                <Switch>
                    <Route exact path="/compare" component={ComparisonSimple} />
                </Switch>
                <Switch>
                    <Route exact path="/get-1-year" component={Get1Year} />
                </Switch>
                <Switch>
                    <Route exact path="/analysis" component={Analysis} />
                </Switch>
                <Switch>
                    <Route exact path="/team" component={Team} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
