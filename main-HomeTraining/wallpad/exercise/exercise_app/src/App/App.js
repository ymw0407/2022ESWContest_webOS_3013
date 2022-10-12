import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import First from "../views/First";
import Loading from "../views/Loading";
import Main from "../views/Main";
import Video from "../views/Video";
import Final from "../views/Final";

const App = () => {
  
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <First />
        </Route>
        <Route path='/load'>
          <Loading />
        </Route>
        <Route path='/main'>
          <Main />
        </Route>
        <Route path='/video'>
          <Video />
        </Route>
        <Route path='/final'>
          <Final />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
