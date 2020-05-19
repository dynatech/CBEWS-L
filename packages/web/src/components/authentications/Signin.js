import React, { useEffect, useState, useRef } from "react";
import { Formik } from "formik";
import {
    Avatar,
    Box,
    Button,
    CssBaseline,
    CardMedia,
    Container,
    Grid,
    Link,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@material-ui/core";
import { Alert as MuiAlert } from '@material-ui/lab';
import { Link as RouteLink, withRouter } from "react-router-dom";
import SigninStyle from "../../styles/sigin_styles";

import { UserManagement } from "@dynaslope/commons";

import dost_seal from "../../assets/dost_seal.png";
import dynaslope_seal from "../../assets/dynaslope_seal.png";
import leon_seal from "../../assets/leon_seal.png";
import mar_seal from "../../assets/mar_seal.png";
import umi_seal from "../../assets/umi_seal.png";
import { useCookies } from "react-cookie";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                CBEWS-L
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function LogoSeries(props) {
    const { classes } = props;
    return (
        <Container className={classes.logo_container}>
            <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={dost_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <CardMedia/>
                    <img className={classes.xs_image} src={dynaslope_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={mar_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={leon_seal} />
                </Grid>
                <Grid item xs={4} md={2}>
                    <img className={classes.xs_image} src={umi_seal} />
                </Grid>
            </Grid>
        </Container>
    );
}

function Alert (props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = SigninStyle();

export default function SignInSide(props) {
    const classes = useStyles();
    const [cookies, setCookie] = useCookies(['credentials']);

    const [loginNotif, setLoginNotif] = useState(false);
    const loginSeverityRef = useRef();

    // useEffect(() => {
    //     if (cookies.credentials !== null) {
    //         handleChangeRoute("dashboard");
    //     }
    // }, []);

    const handleChangeRoute = route => {
        props.history.push(`/${route}`);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setLoginNotif(false);
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <LogoSeries classes={classes} />
                    {/* <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                    <Typography
                        className={classes.sign_in_header}
                        component="h2"
                        variant="h6"
                    >
                        Community Based Early Warning
                    </Typography>
                    <Typography
                        className={classes.sign_in_header}
                        component="h2"
                        variant="h6"
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
                                let response = await UserManagement.UserAuthentication(values);
                                if (response.status === true) {
                                    console.log("signed in");
                                    setCookie('credentials', response.user_data, { path: "/" });
                                    loginSeverityRef.current = (<Alert onClose={handleClose} severity="success">{response.message}</Alert>);
                                    console.log("loginSeverityRef", loginSeverityRef);
                                    handleChangeRoute('dashboard');
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
                                        <Link href="#" variant="body2" onClick={() => handleChangeRoute("forgot-password")}>
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2" onClick={() => handleChangeRoute("signup")}>
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
            <Snackbar open={loginNotif} autoHideDuration={3000} onClose={handleClose}>
                {loginSeverityRef.current}
            </Snackbar>
        </Grid>
    );
}
