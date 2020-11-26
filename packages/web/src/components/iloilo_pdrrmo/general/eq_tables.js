import React, { Fragment, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow
} from "@material-ui/core";

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

    function createData(date_time, depth, magnitude, location, latitude, longitude, ) {
        return { date_time, depth, magnitude, location, latitude, longitude };
    }

    const rows = [
        createData('2019-10-06 04:20:00', '12km', '4', '009 km N 87° W of Calatagan (Batangas)', '13.84', '120.55'),
        createData('2019-10-06 04:00:00', '19km', '6', '002 km N 32° E of Calamba (Laguna)', '14.21', '121.17'),
        createData('2019-10-06 03:50:00', '23km', '2', '004 km S 44° W of Looc (Occidental Mindoro)', '13.70', '120.23'),
        createData('2019-10-06 03:30:00', '42km', '3', '008 km N 64° W of Lipa City (Batangas)', '13.97', '121.10'),
        createData('2019-10-06 03:20:00', '16km', '1', '003 km N 33° W of Aloguinsan (Cebu)', '10.24', '123.54'),
        createData('2019-10-06 03:00:00', '02km', '1.2', '005 km S 51° W of Danao (Bohol)', '09.92', '124.18'),
        createData('2019-10-06 02:20:00', '100km', '6', '004 km N 44° W of Cabangan (Zambales)', '15.19', '120.03'),
        createData('2019-10-06 02:10:00', '33km', '2', '073 km N 68° E of Hinatuan (Surigao Del Sur)', '08.63', '126.96'),
        createData('2019-10-06 02:00:00', '177km', '2', '17 km S 68° W of Nasugbu (Batangas)', '14.02', '120.48'),
    ];

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
                                        <TableCell>Location</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>Latitude</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.depth}</TableCell>
                                            <TableCell>{row.magnitude}</TableCell>
                                            <TableCell>{row.location}</TableCell>
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