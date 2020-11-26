import React, { useState, Fragment } from 'react';
import Header from '../reducers/header';
import MarTabsMenu from '../reducers/mar_tabs_menu'

function MarDashboard(props) {
    return (
        <Fragment>
            <Header {...props}/>
            <MarTabsMenu />
        </Fragment>
    );
}

export default MarDashboard
