import React, { Fragment, useEffect, useState } from 'react';
import {
    Container, Grid, Paper, Box, CardMedia, Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Tabs, Tab
} from '@material-ui/core';
import CustomGridList from '../../reducers/pdrrmo_iloilo/grid_list';
import { makeStyles } from '@material-ui/core/styles';
import { MarCommunityRiskAssessment } from "@dynaslope/commons";

import TransitionalModal from '../../reducers/pdrrmo_iloilo/loading';

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

function MarCRA() {
    const classes = useStyles();
    const dt_classes = tableStyle();

    const [cav_data, setCAVData] = useState([]);

    useEffect(() => {
        initCav();
    }, []);

    const initCav = async () => {
        const response = await MarCommunityRiskAssessment.GetAllCapacityAndVulnerability();
        if (response.status && response.data.length > 0) setCAVData(response.data);
    };

    function createData(resource, quantity, status_description, owner, in_charge, updater) {
        return { resource, quantity, status_description, owner, in_charge, updater };
    }

    // const cav_data = [
    //     createData('Megaphone', '6', 'working', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    //     createData('Two-way radio', '2', 'working', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    //     createData('Batingting', '1', 'broken', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    //     createData('Sirena', '5', 'working', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    //     createData('Cellphone', '10', 'broken', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    //     createData('Landline', '2', 'working', 'Carlo Bontia', 'John Geliberte', 'Tine Dumagan'),
    // ];

    const cra_data = [{
        title: '<FILE_REPORT #1>',
        value: '../../path/file_name.ppt',
        sub_title: 'PPTX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.docx',
        sub_title: 'DOCX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.txt',
        sub_title: 'Txt File'
    },
    {
        title: '<FILE_REPORT #1>',
        value: '../../path/file_name.ppt',
        sub_title: 'PPTX File'
    }]

    const [value, setValue] = useState("hazard_map");
    const [content, setContent] = useState(HazardMap());

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

    const handleChange = (event, app_module) => {

        switch (app_module) {
            case "capacity_and_vulnerability":
                setContent(CaV());
                break;
            case "hazard_map":
                setContent(HazardMap());
                break;
            case "community_risk_assessment":
                setContent(CrA());
                break;
            default:
                break;
        }
        setValue(app_module);

    };

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }


    function CaV() {
        return (
            <Paper>
                <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                    Capacity and Vulnerability
                            </Box>
                <Box style={{ padding: 20 }}>
                    <Grid container align="center" spacing={2} style={{ padding: 20, minHeight: getWindowDimensions().height * 0.638, maxHeight: getWindowDimensions().height * 0.638 }}>
                        <Grid item xs={12}>
                            <Paper className={dt_classes.root}>
                                <Table className={dt_classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Resource</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Status/Description</TableCell>
                                            <TableCell>Owner</TableCell>
                                            <TableCell>In-Charge</TableCell>
                                            <TableCell>Updater</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cav_data.map(row => (
                                            <TableRow key={row.resource}>
                                                <TableCell component="th" scope="row">
                                                    {row.resource}
                                                </TableCell>
                                                <TableCell>{row.quantity}</TableCell>
                                                <TableCell>{row.stat_desc}</TableCell>
                                                <TableCell>{row.owner}</TableCell>
                                                <TableCell>{row.in_charge}</TableCell>
                                                <TableCell>{row.updater}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
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

    function HazardMap() {
        return (
            <Paper>
            <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                Hazard Map
                    </Box>
            <Box style={{ padding: 10 }} align="center">
                <CardMedia
                    image={require('../../../assets/mar_map.jpg')}
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

    function CrA() {
        return(
            <Paper>
                <Box fontSize={30} align="left" fontWeight="bold" style={{ padding: 20 }}>
                    Community Risk Assessment
                </Box>
                <Box style={{ overflowX: 'auto', padding: 20, minHeight: getWindowDimensions().height * 0.71, maxHeight: getWindowDimensions().height * 0.71 }} align="center" >
                    <CustomGridList data={cra_data} />
                </Box>
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
                            style={{ minHeight: getWindowDimensions().height * 0.829, maxHeight: getWindowDimensions().height * 0.829 }}
                        >
                            <Tab value={"hazard_map"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Hazard Map" />
                            <Tab value={"capacity_and_vulnerability"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Capacity and Vulnerability" />
                            <Tab value={"community_risk_assessment"} style={{ paddingTop: '10%', paddingBottom: '10%' }} label="Community Risk Assessment" />
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

export default MarCRA