import React, { Fragment } from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Signin from '../components/authentications/Signin';
import SignUp from '../components/authentications/SignUp';
import DownloadPage from '../components/misc/DownloadPage';
import ForgotPassword from '../components/authentications/ForgotPassword';
import PageNotFound from '../components/authentications/PageNotFound';

import MarDashboard from '../components/marirong/MarirongDashboard';
import UmiDashboard from '../components/umingan/UminganDashboard';
import SigninIloilo from '../components/iloilo_pdrrmo/authentication/Signin';
import IloiloDashboard from '../components/iloilo_pdrrmo/IloIloDashboard';

import { useCookies } from "react-cookie";
import {DashRedirectIfLoggedIn, PrivateRoute} from './RouteType';

function RouterApp() {
  const [cookies] = useCookies(['credentials']);
  const component_object = {
    29: (
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
  return (
    <BrowserRouter>
        {
          site_id !== null && (component_object[parseInt(site_id)])
        }
        <Switch>
        <Route path='/forgot-password' component={ForgotPassword} /> 
        <Route path='/signup' component={SignUp} />
        <DashRedirectIfLoggedIn path='/signin' component={Signin} />
        <DashRedirectIfLoggedIn exact path='/' component={DownloadPage} />
        {/* PDRRMO SECTION */}
        <Route path='/iloilo/signin' component={SigninIloilo} />
        <Route path='/iloilo/dashboard' component={IloiloDashboard} />
        {/* PDRRMO SECTION */}
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default RouterApp;
