import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Exchange from '../pages/exchange'
import Confirm from '../pages/confirm'
import Success from '../pages/success'
import './app.css';

const App = () => {
  return (
    <div className='main'>
      <Switch>
        <Route
          path="/"
          component={Exchange}
          exact />
        <Route
          path="/confirm"
          component={Confirm}
          exact />
        <Route
          path="/success"
          component={Success}
          exact />

      </Switch>
    </div>
  );
};

export default App;