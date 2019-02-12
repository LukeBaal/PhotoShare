import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { getUser } from './actions/auth';
import Login from './components/auth/Login';
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import { auth } from './firebase';
import store from './store';
import Landing from './components/Landing';

class App extends Component<any, any> {
  async componentWillMount() {
    await auth.onAuthStateChanged(
      async user => await store.dispatch(getUser(user))
    );
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navbar />
            <div className="container mt-3">
              <Switch>
                <Route exact path="/" component={Landing} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
