import React, {Fragment, useState} from 'react';
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

function SurficialMarker() {
    function createData(date_time, a, b, c, weather, nag_sukat, nag_encode ) {
        return { date_time, a, b, c, weather, nag_sukat, nag_encode };
    }

    const rows = [
        createData('2019-08-08 07:30:00', '60cm', '58cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-07 07:30:00', '60cm', '57cm', '20cm','MAARAW','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-06 07:30:00', '60cm', '56cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-05 07:30:00', '60cm', '54cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-04 07:30:00', '60cm', '54cm', '20cm','MAULAP','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-03 07:30:00', '60cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-02 07:30:00', '60cm', '53cm', '20cm','MAARAW','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-01 07:30:00', '59cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-07-30 07:30:00', '58cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte')
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
        <Container fixed>
            <Grid container align="center" spacing={4}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    <TableCell>A</TableCell>
                                    <TableCell>B</TableCell>
                                    <TableCell>C</TableCell>
                                    <TableCell>Weather</TableCell>
                                    <TableCell>Nag-sukat</TableCell>
                                    <TableCell>Nag-encode</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.date_time}>
                                        <TableCell component="th" scope="row">
                                            {row.date_time}
                                        </TableCell>
                                        <TableCell>{row.a}</TableCell>
                                        <TableCell>{row.b}</TableCell>
                                        <TableCell>{row.c}</TableCell>
                                        <TableCell>{row.weather}</TableCell>
                                        <TableCell>{row.nag_sukat}</TableCell>
                                        <TableCell>{row.nag_encode}</TableCell>
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

export default SurficialMarker