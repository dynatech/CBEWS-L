import React, { useState, Fragment } from "react";
import {
    AppBar,
    Container,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from "@material-ui/icons/Menu";

// AppBar Hider Imports
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";

import { useCookies } from "react-cookie";

import { LogoSeries } from "../reducers/LogoSeries";
import umi_banner from "../../assets/banner_new.png";

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
}));

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

export default function UmiHeader(props) {
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies(["credentials"]);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const handleSignout = () => {
        removeCookie(["credentials"]);
        alert("Signing out!");
        props.history.push("/signin");
    };

    const toggleDrawer = (side, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [side]: open });
    };

    const drawerList = (side) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {["Profile", "Notifications"].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />

            <List>
                {["Signout"].map((text, index) => (
                    <ListItem button key={text} onClick={handleSignout}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Fragment>
        <AppBar color="inherit" position="fixed" style={{backgroundColor: '#18516c', padding: 10}}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    aria-label="menu"
                    style={{color: '#fa971f'}}
                    onClick={toggleDrawer("left", true)}
                >
                    <MenuIcon />
                </IconButton>
                <LogoSeries siteCode="umi" />
            </Toolbar>
        </AppBar>
        <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
            {drawerList("left")}
        </Drawer>
    </Fragment>
    );
}
