import React, { Fragment, useState } from 'react';
import {
    Container, Grid, Paper, Box, CardMedia, Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Tabs, Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading'

const useStyles = makeStyles(theme => ({
    buttons: {
        width: '90%'
    }
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

function UmiCRA() {
    const classes = useStyles();
    const dt_classes = tableStyle();

    function createData(hazard, speed_of_onset, ewi, impact) {
        return { hazard, speed_of_onset, ewi, impact };
    }

    function createRaCData(resource_capacity, status, owner) {
        return { resource_capacity, status, owner };
    }

    function createFRPData(house_id, number_of_members, belonging_vulnerable_groups, nature_of_vulnerability) {
        return { house_id, number_of_members, belonging_vulnerable_groups, nature_of_vulnerability }
    }

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    const rows = [
        createData('Drought', 'Slow', 'Early Warning', 'One Month'),
        createData('Typhoon', 'Slow', 'PAGASA broadcast, Movement of birds', 'One Week'),
        createData('Earthquake', 'Fast', 'None', 'One Month'),
        createData('Landslide', 'Slow', 'EWS-L', 'One Month')
    ];

    const rows_rac = [
        createRaCData('Evacuation center', 'Excellent', 'BLGU'),
        createRaCData('Vehicles', 'Needs repair', 'BLGU'),
        createRaCData('Batingting', 'Excellent', 'Community'),
        createRaCData('Markers', 'Needs fence', 'Community'),
        createRaCData('Radio', 'Excellent', 'BLGU, MLGU'),
    ];

    const rows_frp = [
        createFRPData('1', '5', '1', 'PWD'),
        createFRPData('2', '6', '4', 'Children'),
        createFRPData('3', '5', '4', 'Children'),
        createFRPData('4', '4', '2', 'Elderly'),
        createFRPData('5', '2', 'None', 'None'),
        createFRPData('6', '2', '1', 'Pregnant')
    ]

    const [value, setValue] = useState("risk_profile");
    const [content, setContent] = useState(RiskProfile());

    const handleChange = (event, app_module) => {

        switch (app_module) {
            case "risk_profile":
                setContent(RiskProfile());
                break;
            case "hazard_map":
                setContent(HazardMap());
                break;
            case "hazard_data":
                setContent(HazardData());
                break;
            case "resource_and_capacities":
                setContent(ResourceAndCapacities());
                break;
            case "family_risk_profile":
                setContent(FamilyRiskProfile());
                break;
            default:
                break;
        }
        setValue(app_module);

    };

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

    function RiskProfile() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper align="left">
                        <Box fontSize={30} fontWeight="bold" style={{ padding: 20 }}>
                            Risk Profile
                            </Box>
                        <Box fontSize={25} fontWeight={200} style={{ padding: 20 }}>
                            October 20, 2019 12:00 PM
                            </Box>
                        <Box fontSize={25} fontWeight={200} style={{ padding: 20 }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </Box>
                        <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    function HazardMap() {
        return (
            <Paper>
                <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                    Hazard Map
                        </Box>
                <Box style={{ padding: 10 }} align="center">
                    <CardMedia
                        image={require('../../../assets/umi_map.jpg')}
                        style={{ height: window.innerHeight * 0.657, width: window.innerHeight }}
                    />
                </Box>
                <Grid container style={{ padding: 20 }}>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {download()}}>
                            Download
                                </Fab>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {print()}}>
                            Print
                                </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
                <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
            </Paper>
        )
    }

    function ResourceAndCapacities() {
        return (<Paper>
            <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                Resources and Capacities
            </Box>
            <Grid container style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Resource/Capacity</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Owner</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows_rac.map(row => (
                                    <TableRow key={row.resource_capacity}>
                                        <TableCell component="th" scope="row">
                                            {row.resource_capacity}
                                        </TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container style={{ padding: 20 }}>
                <Grid item xs={4} />
                <Grid item xs={2}>
                    <Fab variant="extended"
                        color={"primary"}
                        className={classes.buttons}
                        aria-label="add"
                        onClick={() => {download()}}>
                        Download
                    </Fab>
                </Grid>
                <Grid item xs={2}>
                    <Fab variant="extended"
                        color={"primary"}
                        className={classes.buttons}
                        aria-label="add"
                        onClick={() => {print()}}>
                        Print
                    </Fab>
                </Grid>
                <Grid item xs={4} />
            </Grid>
            <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
        </Paper>)
    }

    function FamilyRiskProfile() {
        return (
            <Paper>
                <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                    Family Risk Profile
                            </Box>
                <Grid container style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Household #</TableCell>
                                        <TableCell>Number of members</TableCell>
                                        <TableCell>Number of members belonging to vulnerable groups</TableCell>
                                        <TableCell>nature of vulnerabiity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows_frp.map(row => (
                                        <TableRow key={row.house_id}>
                                            <TableCell component="th" scope="row">
                                                {row.house_id}
                                            </TableCell>
                                            <TableCell>{row.number_of_members}</TableCell>
                                            <TableCell>{row.belonging_vulnerable_groups}</TableCell>
                                            <TableCell>{row.nature_of_vulnerability}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container style={{ padding: 20 }}>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {download()}}>
                            Download
                                    </Fab>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {print()}}>
                            Print
                                    </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
                <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
            </Paper>
        )
    }


    function HazardData() {
        return (
            <Paper >
                <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                    Hazard Data
                </Box>
                <Grid container style={{ padding: 20, minHeight: getWindowDimensions().height * 0.677, maxHeight: getWindowDimensions().height * 0.677 }}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Hazard</TableCell>
                                        <TableCell>Speed of Onset</TableCell>
                                        <TableCell>Early Warning</TableCell>
                                        <TableCell>Impact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.hazard}>
                                            <TableCell component="th" scope="row">
                                                {row.hazard}
                                            </TableCell>
                                            <TableCell>{row.speed_of_onset}</TableCell>
                                            <TableCell>{row.ewi}</TableCell>
                                            <TableCell>{row.impact}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container style={{ padding: 20 }}>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {download()}}>
                            Download
                        </Fab>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color={"primary"}
                            className={classes.buttons}
                            aria-label="add"
                            onClick={() => {print()}}>
                            Print
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
                <Box borderTop={2} borderRadius="50%" borderColor="#17526d" />
            </Paper>
        )
    }

    return (
        <Fragment>
            <Grid container>
                <Grid item xs={2} >
                    <Paper square>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                            centered
                            style={{ minHeight: getWindowDimensions().height * 0.845, maxHeight: getWindowDimensions().height * 0.85 }}
                        >
                            <Tab value={"risk_profile"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Risk Profile" />
                            <Tab value={"hazard_map"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Hazard Map" />
                            <Tab value={"hazard_data"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Hazard Data" />
                            <Tab value={"resource_and_capacities"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Resources and Capacities" />
                            <Tab value={"family_risk_profile"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Family Risk Profile" />
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid item xs={9} style={{ height: getWindowDimensions().height * 0.845 }}>
                    {content}
                </Grid>
            </Grid>
            {modal}
        </Fragment>
    )
}

export default UmiCRA