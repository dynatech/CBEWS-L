import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Signin from '../components/authentications/Signin';
import SignUp from '../components/authentications/SignUp';
import ForgotPassword from '../components/authentications/ForgotPassword';
import SigninCopy from '../components/authentications/Signin-copy';
import PageNotFound from '../components/authentications/PageNotFound';

import Dashboard from '../components/Dashboard';

function RouterApp() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Signin} />
        <Route path='/copy' component={SigninCopy} />
        <Route path='/signup' component={SignUp} />
        <Route path='/forgot-password' component={ForgotPassword} />
        <Route path='/dashboard' component={Dashboard} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default RouterApp;
