import React, {Fragment} from 'react';
import {Container} from '@material-ui/core'
import {
    AlertStatus,
    CRA,
    Maintenance,
    GroundData,
    SensorData,
    Reports
} from '../components/mar/menu';


function handleContent(app_key) {
    let body_content = []
    switch (app_key) {
        case "mar_cra":
            body_content = [<CRA />]
            break;
        case "mar_alertStatus":
            body_content = [<AlertStatus />]
            break;
        case "mar_sensorData":
            body_content = [<SensorData />]
            break;
        case "mar_groundData":
            body_content = [<GroundData />]
            break;
        case "mar_reports":
            body_content = [<Reports />]
            break;
        case "mar_maintenance":
            body_content = [<Maintenance />]
            break;
        default:
            body_content = [<CRA />]
            break;
    }
    return body_content
}

function MarContent({app_key}) {
    return(
        <Fragment>
            {handleContent(app_key)}
        </Fragment>
    )
}

export default MarContent