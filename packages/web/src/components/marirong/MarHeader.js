import React, { useState, Fragment } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from "@material-ui/icons/Menu";
import { useCookies } from "react-cookie";

import { LogoSeries } from "../reducers/LogoSeries";

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
}));

export default function MarHeader(props) {
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies(['credentials'])
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const handleSignout = () => {
        console.log("props", props);
        removeCookie(["credentials"]);
        alert("Signing out!")
        props.history.push("/signin")
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
                    <ListItem
                        button
                        key={text}
                        onClick={handleSignout}
                    >
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Fragment>
            <AppBar color="inherit" position="fixed" style={{backgroundColor: '#18516c'}}>
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
                    <LogoSeries siteCode="mar" />
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
                {drawerList("left")}
            </Drawer>
        </Fragment>
    );
}
