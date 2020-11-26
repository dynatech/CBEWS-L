import React, {Fragment} from 'react';
import {Container, Box} from '@material-ui/core'
import {
    CRA,
    AlertStatus,
    SensorData,
    GroundData,
    Reports,
    Maintenance
} from '../../iloilo_pdrrmo/merged/menu';


function handleContent(app_key) {
    let body_content = []
    switch (app_key) {
        case "cra":
            body_content = [<CRA />]
            break;
        case "alertStatus":
            body_content = [<AlertStatus />]
            break;
        case "sensorData":
            body_content = [<SensorData />]
            break;
        case "groundData":
            body_content = [<GroundData />]
            break;
        case "reports":
            body_content = [<Reports />]
            break;
        case "maintenance":
            body_content = [<Maintenance />]
            break;
        default:
            body_content = [<CRA />]
            break;
    }
    return body_content
}

function Content({app_key}) {
    return(
        <Fragment>
            {handleContent(app_key)}
        </Fragment>
    )
}

export default Content