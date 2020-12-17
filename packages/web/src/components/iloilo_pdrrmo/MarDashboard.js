import React, { useState, Fragment } from 'react';
import Header from '../reducers/pdrrmo_iloilo/header';
import MarTabsMenu from '../reducers/pdrrmo_iloilo/mar_tabs_menu'

function MarDashboard(props) {
    return (
        <Fragment>
            <Header {...props}/>
            <MarTabsMenu />
        </Fragment>
    );
}

export default MarDashboard
