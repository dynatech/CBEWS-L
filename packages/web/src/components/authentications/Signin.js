import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import {
    Avatar,
    Box,
    Button,
    CssBaseline,
    CardMedia,
    Container,
    Image,
    Grid,
    Link,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
import { Link as RouteLink, withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";

import { makeStyles } from "@material-ui/core/styles";
import SigninStyle from "../../styles/signin_styles";
import { UserManagement } from "@dynaslope/commons";
import { LogoSeries } from "../reducers/LogoSeries";
import tile_1 from "../../assets/tile/tile_1.png";
import tile_2 from "../../assets/tile/tile_2.png";
import tile_3 from "../../assets/tile/tile_3.png";
import tile_4 from "../../assets/tile/tile_4.png";
import { SignInLogo } from "../reducers/SignInLogo";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="/">
                CBEWS-L
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = SigninStyle();
const imageDivider = makeStyles((theme) => ({
    animated_divider: {
        display: "none",
        "@media (min-width:600px)": {
            fontSize: "none",
        },
        [theme.breakpoints.up("md")]: {
            display: "initial",
        },
    },
}));

export default function SignInSide(props) {
    const classes = useStyles();
    const imageDiv = imageDivider();
    const [cookies, setCookie] = useCookies(["credentials"]);

    const [loginNotif, setLoginNotif] = useState(false);
    const loginSeverityRef = useRef();

    const handleChangeRoute = (route) => {
        // Fix to redirect not always working when user is logged-in
        if (route == "dashboard") {
            window.location.reload();
        }
        props.history.push(`/${route}`);
    };

    useEffect(() => {
        if ("credentials" in cookies && "site_id" in cookies.credentials) {
            handleChangeRoute("dashboard");
        }
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setLoginNotif(false);
    };

    const mouseIn = (id) => {
        switch (id) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                break;
        }
    };

    const mouseOut = (id) => {
        switch (id) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                break;
        }
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid
                className={imageDiv.animated_divider}
                item
                xs={false}
                sm={3}
                md={7}
            >
                <div>
                    <img
                        src={tile_1}
                        style={{
                            position: "fixed",
                            width: "58.3%",
                            height: "100%",
                        }}
                        onMouseOver={() => {
                            mouseIn(1);
                        }}
                        onMouseOut={() => {
                            mouseOut(1);
                        }}
                    />
                    <img
                        src={tile_2}
                        style={{
                            position: "fixed",
                            width: "58.3%",
                            height: "100%",
                        }}
                        onMouseOver={() => {
                            mouseIn(2);
                        }}
                        onMouseOut={() => {
                            mouseOut(2);
                        }}
                    />
                    <img
                        src={tile_3}
                        style={{
                            position: "fixed",
                            width: "58.3%",
                            height: "100%",
                        }}
                        onMouseOver={() => {
                            mouseIn(3);
                        }}
                        onMouseOut={() => {
                            mouseOut(3);
                        }}
                    />
                    <img
                        src={tile_4}
                        style={{
                            position: "fixed",
                            width: "58.3%",
                            height: "100%",
                        }}
                        onMouseOver={() => {
                            mouseIn(4);
                        }}
                        onMouseOut={() => {
                            mouseOut(4);
                        }}
                    />
                </div>
            </Grid>
            <Grid
                item
                xs={12}
                sm={12}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <SignInLogo classes={classes} />
                    {/* <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar> */}
                    <Typography
                        className={classes.sign_in_header}
                        component="h2"
                        variant="h3"
                    >
                        Community Based Early Warning
                    </Typography>
                    <Typography
                        className={classes.sign_in_header}
                        component="h2"
                        variant="h3"
                        style={{ paddingBottom: "5%" }}
                    >
                        Information for Landslides
                    </Typography>
                    <Formik
                        initialValues={{ username: "", password: "" }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.username) {
                                errors.username = "Required";
                            } else if (/\s/.test(values.username)) {
                                errors.username = "No whitespaces in username";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(async () => {
                                let response =
                                    await UserManagement.UserAuthentication(
                                        values,
                                    );
                                if (response.status === true) {
                                    setCookie(
                                        "credentials",
                                        response.user_data,
                                        { path: "/" },
                                    );
                                    loginSeverityRef.current = (
                                        <Alert
                                            onClose={handleClose}
                                            severity="success"
                                        >
                                            {response.message}
                                        </Alert>
                                    );
                                    handleChangeRoute("dashboard");
                                } else {
                                    console.error("problem signing in");
                                }
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            /* and other goodies */
                        }) => (
                            <form
                                className={classes.form}
                                onSubmit={handleSubmit}
                            >
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoFocus
                                    required
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                />
                                {errors.username &&
                                    touched.username &&
                                    errors.username}
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    type="password"
                                    name="password"
                                    label="Password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                {errors.password &&
                                    touched.password &&
                                    errors.password}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={isSubmitting}
                                >
                                    Sign In
                                </Button>

                                <Grid container>
                                    <Grid item xs>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            onClick={() =>
                                                handleChangeRoute(
                                                    "forgot-password",
                                                )
                                            }
                                        >
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            onClick={() =>
                                                handleChangeRoute("signup")
                                            }
                                        >
                                            Create account
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Box mt={5}>
                                    <Copyright />
                                </Box>
                            </form>
                        )}
                    </Formik>
                </div>
            </Grid>
            <Snackbar
                open={loginNotif}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                {loginSeverityRef.current}
            </Snackbar>
        </Grid>
    );
}
