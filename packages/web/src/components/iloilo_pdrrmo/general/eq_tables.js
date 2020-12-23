import React, { Fragment, useState, useEffect } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow
} from "@material-ui/core";

import { MergedData } from '@dynaslope/commons';

import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading';


const tableStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
}));

const useStyles = makeStyles(theme => ({

    button_fluid: {
        width: '90%',
        padding: 10
    },

}));



function EarthquakeTables() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await MergedData.GetIloiloEarthquakeData();
        if (response.status) {
            console.log("Response is: ", response);
            setRows(response.data);
        }
    }

    const dt_classes = tableStyle();
    const classes = useStyles();

    const [modal, setModal] = useState([<TransitionalModal status={false} />])

    function download() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Download success!")
        }, 3000)
    }

    function print() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Print success!")
        }, 3000)
    }

    return (
        <Fragment>
            <Container>
                <Grid container align="center" spacing={4}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Depth</TableCell>
                                        <TableCell>Magnitude</TableCell>
                                        {/* <TableCell>Location</TableCell> */}
                                        <TableCell>Site Affected</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>Latitude</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.ts}>
                                            <TableCell component="th" scope="row">
                                                {row.ts}
                                            </TableCell>
                                            <TableCell>{row.depth}</TableCell>
                                            <TableCell>{row.magnitude}</TableCell>
                                            {/* <TableCell>{row.location}</TableCell> */}
                                            <TableCell>{row.site}</TableCell>
                                            <TableCell>{row.latitude}</TableCell>
                                            <TableCell>{row.longitude}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid container align="center" style={{ paddingBottom: 20 }}>
                        <Grid item xs={3} />
                        <Grid item xs={3}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => {download()}}>
                                Download
                            </Fab>
                        </Grid>
                        <Grid item xs={3}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => {print()}}>
                                Print
                            </Fab>
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Container>
            {modal}
        </Fragment>
    )
}

export default EarthquakeTables