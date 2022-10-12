import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Frontdoor from "../views/CCTV/Frontdoor";
import Playground from "../views/CCTV/Playground";
import Parking from "../views/CCTV/Parking";


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Frontdoor />
        </Route>
        <Route path='/frontdoor'>
          <Frontdoor />
        </Route>
        <Route path='/playground'>
          <Playground />
        </Route>
        <Route path='/parking'>
          <Parking />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;