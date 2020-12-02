import React, { useEffect, useState, useRef } from "react";
import { LogoCenter } from '../../reducers/pdrrmo_iloilo/Logos';
import AppTitle from '../../reducers/pdrrmo_iloilo/AppTitle';
import { Container, Grid, TextField, Button, Snackbar } from '@material-ui/core/';
import { UserManagement } from "@dynaslope/commons";
import { Formik } from "formik";
import { Alert as MuiAlert } from '@material-ui/lab';
import { useCookies } from "react-cookie";


function Alert (props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SigninIloilo(props) {

    const [cookies, setCookie] = useCookies(['credentials']);
    const [loginNotif, setLoginNotif] = useState(false);
    const loginSeverityRef = useRef();

    const handleChangeRoute = route => {
        props.history.push(`/${route}`);
    };

    useEffect(() => {
        if ("credentials" in cookies && "site_id" in cookies.credentials) {
            handleChangeRoute("iloilo/dashboard");
        }
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setLoginNotif(false);
    }
    
    return (
        <Container>
            <LogoCenter />
            <AppTitle />
            <Grid container alignItems="center" justify="center">
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
                                switch(response.user_data.role_restrictions) {
                                    case '3':
                                        setCookie('credentials', response.user_data, { path: "/iloilo/dashboard" });
                                        loginSeverityRef.current = (<Alert onClose={handleClose} severity="success">{response.message}</Alert>);
                                        handleChangeRoute('iloilo/dashboard');
                                        break;
                                    default:
                                        loginSeverityRef.current = (<Alert onClose={handleClose} severity="warning">Signin restricted! User account is not eligible to access this page.</Alert>);
                                        break;
                                }

                            } else {
                                loginSeverityRef.current = (<Alert onClose={handleClose} severity="warning">Signin failed! Incorrect username / password.</Alert>);
                            }
                            setLoginNotif(true);
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
                                disabled={isSubmitting}
                            >
                                Sign In
                            </Button>
                        {/* 
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
                            </Grid> */}
                        </form>
                    )}
                </Formik>
            </Grid>
            <Snackbar open={loginNotif} autoHideDuration={3000} onClose={handleClose}>
                {loginSeverityRef.current}
            </Snackbar>
        </Container>
    )

}

export default SigninIloilo