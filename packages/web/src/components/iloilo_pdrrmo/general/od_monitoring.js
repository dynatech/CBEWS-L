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

function ODMonitoring() {
    function createData(date_time, reporter, monitoring_reason, attachments) {
        return { date_time, reporter, monitoring_reason, attachments};
    }

    const rows = [
        createData('2019-08-08 07:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-08-02 11:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-07-29 11:30:00', 'John Geliberte', 'Lumindol ng mahina', 'N/A'),
        createData('2019-07-20 15:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-07-19 20:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-06-20 23:00:00', 'John Geliberte', 'May gumuhong lupa', 'N/A'),
        createData('2019-05-02 01:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-04-01 02:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-01-30 02:30:00', 'John Geliberte', 'Lumindol ng malakas', 'N/A')
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
            <Grid container align="center" spacing={2}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    <TableCell>Reporter</TableCell>
                                    <TableCell>Reason for Monitoring</TableCell>
                                    <TableCell>Attachments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.date_time}>
                                        <TableCell component="th" scope="row">
                                            {row.date_time}
                                        </TableCell>
                                        <TableCell>{row.reporter}</TableCell>
                                        <TableCell>{row.monitoring_reason}</TableCell>
                                        <TableCell>{row.attachments}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid container align="center" style={{ paddingTop: 20 }}>
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
        {setModal}
    </Fragment>
    )
}

export default ODMonitoring