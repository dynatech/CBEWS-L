import React, { Fragment } from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Signin from '../components/authentications/Signin';
import SignUp from '../components/authentications/SignUp';
import ForgotPassword from '../components/authentications/ForgotPassword';
import PageNotFound from '../components/authentications/PageNotFound';

import MarDashboard from '../components/marirong/MarirongDashboard';
import UmiDashboard from '../components/umingan/UminganDashboard';
import { useCookies } from "react-cookie";

function RouterApp() {
  const [cookies, setCookies] = useCookies(['credentials']);
  console.log("cookies",cookies);
  const component_object = {
    51: (
      <Fragment>
        <Route path='/dashboard' component={MarDashboard} />
      </Fragment>
    ),
    50: (
      <Fragment>
        <Route path='/dashboard' component={UmiDashboard} />
      </Fragment>
    )
  }
  const site_id = "credentials" in cookies && "site_id" in cookies.credentials ? cookies.credentials.site_id : null;
  console.log("site_id", site_id)

  return (
    <BrowserRouter>
      <Switch>
        {
          site_id !== null && component_object[site_id]
        }
        <Route path='/forgot-password' component={ForgotPassword} /> 
        <Route path='/signup' component={SignUp} />
        <Route exact path='/' component={Signin} />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default RouterApp;
