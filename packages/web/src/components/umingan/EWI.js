import React, { useState, Fragment } from "react";
// import { Container, Grid, Fab } from "@material-ui/core";
import { AlertValidation, CurrentAlert } from "./EWIFeature";
// import { useStyles } from "../../styles/general_styles";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Fragment>{children}</Fragment>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        "aria-controls": `nav-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // width: "100%",
        marginTop: 10,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function EWI() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // const [feature, setFeature] = useState(<AlertValidation />);
    // const [av, avActive] = useState("primary");
    // const [lca, lcaActive] = useState("");

    // function handleFeatureNav(feature) {
    //     let return_feat = [];
    //     switch (feature) {
    //         case "alert_validation":
    //             lcaActive("");
    //             avActive("primary");
    //             return_feat = <AlertValidation />
    //             break;
    //         case "current_alert":
    //             lcaActive("primary");
    //             avActive("");
    //             return_feat = <CurrentAlert />;
    //             break;
    //         default:
    //             lcaActive("primary");
    //             avActive("");
    //             return_feat = <CurrentAlert />;
    //             break;
    //     }
    //     setFeature(return_feat);
    // }

    // const classes = useStyles();
    return (
        // <Fragment>
        //     <Container maxWidth="xl" className={classes.root} spacing={24}>
        //         <Grid container alignItems="center" justify="center">
        //             <Grid item xs={3} >
        //                 <Grid container direction="column" className={classes.menuContainer}>
        //                     {/* <Grid item={true} xs={3} style={{ marginTop: '30%' }} /> */}
        //                     <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
        //                         <Fab variant="extended"
        //                             color={av}
        //                             aria-label="add"
        //                             className={classes.menu}
        //                             onClick={() => { handleFeatureNav("alert_validation") }}>
        //                             Alert Validation
        //                         </Fab>
        //                     </Grid>
        //                     <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
        //                         <Fab variant="extended"
        //                             color={lca}
        //                             aria-label="add"
        //                             className={classes.menu}
        //                             onClick={() => { handleFeatureNav("current_alert") }}>
        //                             Current Alert
        //                         </Fab>
        //                     </Grid>
        //                     {/* <Grid item={true} xs={3} style={{ marginTop: '30%' }} /> */}
        //                 </Grid>
        //             </Grid>
        //             <Grid item xs={9} >
        //             <div style={{overflow: 'auto', height: 660}}>
        //                 {feature}
        //             </div>
        //             </Grid>
        //         </Grid>
        //     </Container>
        // </Fragment>

        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="EWI Module"
                >
                    <Tab label="Current Alert" {...a11yProps(0)} />
                    <Tab label="Alert Validation" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <CurrentAlert />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AlertValidation />
            </TabPanel>
        </div>
    );
}
