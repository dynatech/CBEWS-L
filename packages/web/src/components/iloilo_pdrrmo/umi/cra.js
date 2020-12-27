import React, { Fragment, useState, useEffect } from 'react';
import {
    Container, Grid, Paper, Box, CardMedia, Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Tabs, Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading'

import { UmiSituationReport, UmiRiskManagement } from "@dynaslope/commons";

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

    const [sit_rep, setSitRep] = useState("No available report");
    const [rnc_rows, setRNCRows] = useState([]);
    const [frp_rows, setFRPRows] = useState([]);
    const [hd_rows, setHDrows] = useState([]);

    useEffect(() => {
        initSitRep();
        initRnc();
        initFrp();
        initHd();
    }, []);

    const initSitRep = async () => {
        const response = await UmiSituationReport.GetCurrentSituationReport();
        if (response.status && response.data.length > 0) setSitRep(response.data[0].report_summary);
    };

    const initRnc = async () => {
        const response = await UmiRiskManagement.GetAllResourceAndCapacities();
        if (response.status && response.data.length > 0) setRNCRows(response.data);
    };

    const initFrp = async () => {
        const response = await UmiRiskManagement.GetAllFamilyRiskProfile();
        if (response.status && response.data.length > 0) setFRPRows(response.data);
    };

    const initHd = async () => {
        const response = await UmiRiskManagement.GetAllHazardData();
        if (response.status && response.data.length > 0) setHDrows(response.data);
    };

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

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
                            {sit_rep}
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
                                {/* {rows_rac.map(row => ( */}
                                {rnc_rows.map(row => (
                                    <TableRow key={row.resource_and_capacities}>
                                        <TableCell component="th" scope="row">
                                            {row.resource_and_capacities}
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
                                        <TableCell>Nature of vulnerabiity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {frp_rows.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell>{row.number_of_members}</TableCell>
                                            <TableCell>{row.vulnerable_groups}</TableCell>
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
                                    {hd_rows.map(row => (
                                        <TableRow key={row.hazard}>
                                            <TableCell component="th" scope="row">
                                                {row.hazard}
                                            </TableCell>
                                            <TableCell>{row.speed_of_onset}</TableCell>
                                            <TableCell>{row.early_warning}</TableCell>
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