import React, { useState, Fragment } from 'react';
import Header from '../reducers/pdrrmo_iloilo/header';
import UmiTabsMenu from '../reducers/pdrrmo_iloilo/umi_tabs_menu';

function UmiDashboard(props) {
    return (
        <Fragment>
            <Header {...props}/>
            <UmiTabsMenu />
        </Fragment>
    );
}

export default UmiDashboard
