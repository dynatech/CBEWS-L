import React from 'react';
import {
    Grid, Fab, makeStyles, Box, Typography
} from "@material-ui/core";
import AppConfig from "../reducers/AppConfig";

import { MarCommunityRiskAssessment } from '@dynaslope/commons';

const customGridStyle = makeStyles(theme => ({
    grid_container: {
        padding: 20
    },
    title: {
        color: "#17526d"
    },
    button_fluid: {
        width: '90%',
        padding: 10
    },
    bottom_padding: {
        padding: 10
    }
}));

export default function GridList(props) {
    const { data, type, handleDownload, handleDelete } = props;
    const classes = customGridStyle();
    let ret_val = [];

    const handleDownloadInt = (item) => () => {
        MarCommunityRiskAssessment.DownloadCommunityRiskAssessmentFile(item.title);
    };

    data.forEach((item)=> {
        const handler_type = type === null || typeof type === "undefined" ? null : type;
        
        ret_val.push(
            <Grid item xs={12}>
                <Grid container className={classes.grid_container}>
                    <Grid item xs={12} >
                        <Box borderTop={2} borderRadius="10%" borderColor="#17526d">
                            <Typography variant="h4" className={classes.title}>
                                {item.title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            {item.sub_title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={4} />
                            <Grid item xs={2}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={classes.button_fluid}
                                    // onClick={handleDownload(item, item.title)}
                                    onClick={handleDownloadInt(item)}
                                >
                                    Download
                                </Fab>
                            </Grid>
                            <Grid item xs={2}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={classes.button_fluid}
                                    // onClick={() => {}}
                                    onClick={handleDelete(item.title)}
                                >
                                    DELETE
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.bottom_padding}>
                        <Box borderBottom={2} borderRadius="10%" borderColor="#17526d">
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        )
    });

    return (<Grid container>{ret_val}</Grid>)
}
