import React, { Fragment } from 'react';
import { 
    Container, Paper, Typography, 
} from "@material-ui/core";

export default function LatestMeasurement(props) {
    const { classes, latestMeas } = props; 
    console.log("latestMeas", latestMeas);
    return (
        <Container style={{minHeight: window.innerHeight - 220}}>
            <Paper style={{ padding: "2%" }}>
                <Typography variant="h5">Surficial Measurement</Typography>
                {
                    latestMeas !== null ? (
                        <Fragment>
                            <Typography variant="subtitle2">Latest surficial data was received last {latestMeas.data.ts}</Typography>
                            {
                                latestMeas.markers.map(marker => {
                                    return (
                                    <Typography>Marker {marker.marker_name}: {latestMeas.data[marker.marker_name]}</Typography>
                                    )
                                })
                            }
                        </Fragment>
                    ) : (
                        <Typography variant="subtitle2">No surficial data available.</Typography>
                    )
                }
            </Paper>
        </Container>
    )    
}
