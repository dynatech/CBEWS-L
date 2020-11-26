import React, { Fragment, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Box, Typography, TextField, MenuItem
} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    menuContainer: {
        // marginTop: '40%'
    },
    menu: {
        width: '100%',
        marginRight: '5%'
    },
    textField: {
        width: '100%'
    },
    button_fluid: {
        width: '90%',
        marginTop: '5%'
    }
}));

const imageStyle = makeStyles(theme => ({
    img_size: {
        height: '100%',
        width: '100%'
    },
    summary_content: {
        minHeight: 500
    }
}));

const summaryStyle = makeStyles(theme => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415
    }
}));


function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}


function Reports() {
    const classes = useStyles();
    const img = imageStyle();
    const summary = summaryStyle();

    const [report, setReport] = useState('sensor_data');
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: false,
    });

    const report_list = [
        {
            value: 'sensor_data',
            label: 'Sensor Data'
        },
        {
            value: 'cra',
            label: 'Community Risk Assessment'
        },
        {
            value: 'data_analysis',
            label: 'Data Analysis'
        },
        {
            value: 'ground_data',
            label: 'Ground Data'
        },
        {
            value: 'alert_status',
            label: 'Alert Status'
        },
        {
            value: 'maintenance',
            label: 'Maintenance'
        }
    ]


    const handleChange = key_template => event => {
        console.log(event.target.value)
        setReport(event.target.value);
    };

    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    const handleSelectedStartDate = date => {
        setSelectedStartDate(date);
    };

    const handleSelectedEndDate = date => {
        setSelectedEndDate(date);
    };

    const handleChangeChkbox = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    return (
        <Fragment>
            <Container className={classes.root} align="center">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper>
                            <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                                Reports
                            </Box>
                            <Container>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <Box>
                                            Select Site
                                        </Box>
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
                                    <Grid item xs={2}>
                                        <TextField
                                            id="standard-select-currency"
                                            select
                                            label="Report type"
                                            className={classes.textField}
                                            value={report}
                                            onChange={handleChange('report')}
                                            SelectProps={{
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            helperText="E.g. Sensor Data"
                                            margin="normal"
                                        >
                                            {report_list.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="MM-DD-YYYY HH:mm:ss"
                                                margin="normal"
                                                id="date-picker-start"
                                                label="Date Start"
                                                value={selectedStartDate}
                                                onChange={handleSelectedStartDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="MM-DD-YYYY HH:mm:ss"
                                                margin="normal"
                                                id="date-picker-start"
                                                label="Date End"
                                                value={selectedEndDate}
                                                onChange={handleSelectedEndDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Generate
                                            </Fab>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Container style={{ padding: 10 }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Paper>
                                                        <Grid item xs={12}>
                                                            <img src={require('../../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                                                        </Grid>
                                                        <Grid item xs={12} className={summary.content}>
                                                            Content 1
                                                    </Grid>
                                                        <Grid item xs={12}>
                                                            <img src={require('../../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Container style={{ padding: 10 }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Paper>
                                                        <Grid item xs={12}>
                                                            <img src={require('../../../assets/letter_header.png')} className={img.img_size} alt="footer" />
                                                        </Grid>
                                                        <Grid item xs={12} className={summary.content}>
                                                            Content 2
                                                    </Grid>
                                                        <Grid item xs={12}>
                                                            <img src={require('../../../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                                                        </Grid>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </Grid>
                                </Grid>
                            </Container>
                            <Container>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Download
                                        </Fab>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Print
                                        </Fab>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Send to Email
                                        </Fab>
                                    </Grid>
                                </Grid>
                            </Container>
                            <Box borderTop={2} borderRadius="50%" borderColor="#17526d" style={{ marginTop: '2.5%' }} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default Reports