import React, { useState, Fragment } from 'react';
import Header from '../../components/reducers/pdrrmo_iloilo/Header';
import SiteSelection from './site_selection';
import TabsMenu from '../../components/reducers/pdrrmo_iloilo/TabsMenu';
import { withRouter } from 'react-router-dom'

function IloiloDashboard(props) {

    return (
        <Fragment>
            <Header {...props} />
            <TabsMenu {...props} />
        </Fragment>
    );
}

export default withRouter(IloiloDashboard)
