import React, { useState, Fragment } from 'react';
import Header from '../reducers/header';
import UmiTabsMenu from '../reducers/umi_tabs_menu';

function UmiDashboard(props) {
    return (
        <Fragment>
            <Header {...props}/>
            <UmiTabsMenu />
        </Fragment>
    );
}

export default UmiDashboard
