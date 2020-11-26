import React, { Fragment, useState } from 'react'
import { Container, Grid, Fab, Paper, Table,
    TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
// import '../../../node_modules/@fullcalendar/core/main.css';
// import '../../../node_modules/@fullcalendar/daygrid/main.css';

import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const imageStyle = makeStyles(theme => ({
    img_size: {
        height: '100%',
        width: '100%'
    },
    summary_content: {
        minHeight: 250
    }
}));

const summaryStyle = makeStyles(theme => ({
    content: {
        minHeight: getWindowDimensions().height * 0.295,
        maxHeight: getWindowDimensions().height * 0.295
    }
}));

const generalStyle = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
}));

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

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}



function IncidentReports() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    function createData( date_time, incident_narrative, reporter, attachment ) {
        return { date_time, incident_narrative, reporter, attachment, reporter, attachment };
    }

    const rows = [
        createData('2019-10-06 04:20:00', 'Nasira ng mga bata ang kawad sa sensor', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 04:00:00', 'Natangal ang pan salok ng sensor', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:50:00', 'Nasira ang bakod', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:30:00', 'Nawala ang battery', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:20:00', 'Nabasa ng ulan ang loob ng data logger', 'Carlo Bontia', 'NA'),
    ];

    const [modal, setModal] = useState([<TransitionalModal status={false} />])
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: false,
    });

    const [showIncidentReport, setShowIncidentReport] = useState([]);
    

    const handleChangeChkbox = name => event => {
        let stats = { ...state, [name]: event.target.checked }
        setState(stats);
        if (stats.checkedA === false && stats.checkedB === false) {
            setState({checkedA: true, checkedB: false});
        }

        if (stats.checkedB === true) {
            setShowIncidentReport(
                <Grid container style={{paddingTop: '10%'}}>
                    <Grid item xs={6}>
                        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container>
                            <Paper>
                                <Grid item xs={12}>
                                    <img src={require('../../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                                </Grid>
                                <Grid item xs={12} className={summary.content}>
                                    Content (Marirong)
                                </Grid>
                                <Grid item xs={12}>
                                    <img src={require('../../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                                </Grid>
                            </Paper>
                            <Grid item xs={12}>
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
                        </Grid>

                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Incident Desc / Narrative</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Attachment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.incident_narrative}</TableCell>
                                            <TableCell>{row.reporter}</TableCell>
                                            <TableCell>{row.attachment}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            )
        }
        else {
            setShowIncidentReport([]);
        }
    }

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
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                <Grid item xs={12}>
                        <Container align="left">
                            <Grid container>
                                <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Select Site: </FormLabel>
                                    <Grid item xs={6}>

                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={state.checkedA}
                                                        onChange={handleChangeChkbox('checkedA')}
                                                        value="checkedA"
                                                        color="primary"
                                                    />
                                                }
                                                label="Umingan"
                                            />

                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={state.checkedB}
                                                        onChange={handleChangeChkbox('checkedB')}
                                                        value="checkedB"
                                                        color="primary"
                                                    />
                                                }
                                                label="Marirong"
                                            />
                                        </FormGroup>
                                    </Grid>

                                </FormControl>

                            </Grid>
                        </Container>
                    </Grid>
                    <Grid item xs={6}>
                        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container>
                            <Paper>
                                <Grid item xs={12}>
                                    <img src={require('../../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                                </Grid>
                                <Grid item xs={12} className={summary.content}>
                                    Content (Umingan)
                                </Grid>
                                <Grid item xs={12}>
                                    <img src={require('../../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                                </Grid>
                            </Paper>
                            <Grid item xs={12}>
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
                        </Grid>

                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Incident Desc / Narrative</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Attachment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.incident_narrative}</TableCell>
                                            <TableCell>{row.reporter}</TableCell>
                                            <TableCell>{row.attachment}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                {showIncidentReport}
            </Container>
            {modal}
        </Fragment>
    )
}

export default IncidentReports