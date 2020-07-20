import React from "react";
import { Formik } from "formik";
import {
    Avatar, Button, CssBaseline,
    TextField, FormControlLabel, Link,
    Grid, Box, Typography, Container, 
    FormControl, InputLabel, Select,
    MenuItem,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { UserManagement } from "@dynaslope/commons";

import SigninStyle from "../../styles/signin_styles";

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

const useStyles = SigninStyle();

export default function SignUp(props) {
    const classes = useStyles();

    let defaultValues = {
        firstname: "",
        lastname: "",
        middlename: "",
        mobile_no: "",
        email: "",
        age: "0",
        gender: "m",
        username: "",
        password: "",
        cpassword: "",
        site: "mar",
        org: "lewc",
    };

    let sites = [
        { label: "Marirong", value: "mar" },
        { label: "Umingan", value: "umi" },
    ];

    let orgs = [
        { label: "LEWC", value: "lewc" },
        { label: "BLGU", value: "blgu" },
        { label: "MLGU", value: "mlgu" },
        { label: "PLGU", value: "PLGU" },
        { label: "PNP", value: "pnp" },
        { label: "Public", value: "pub" },
    ];

    const handleChangeRoute = (route) => {
        props.history.push(`/${route}`);
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Formik
                    initialValues={defaultValues}
                    validate={(values) => {
                        const errors = {};
                        if (!values.username) {
                            errors.username = "Required";
                        } else if (/\s/.test(values.username)) {
                            errors.username = "No whitespaces in username";
                        }

                        if (!values.firstname) {
                            errors.firstname = "Required";
                        }
                        if (!values.lastname) {
                            errors.lastname = "Required";
                        }

                        if (!values.mobile_no) {
                            errors.mobile_no = "Required";
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(async () => {
                            let response = await UserManagement.AuthRegistration(values);
                            console.log("response", response);
                            if (response.status === true) {
                                handleChangeRoute('');
                            } else {
                                console.error("problem submitting");
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
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstname"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstname"
                                        label="First Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoFocus
                                        value={values.firstname}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="middlename"
                                        label="Middle Name"
                                        name="middlename"
                                        autoComplete="lname"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.middlename}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastname"
                                        label="Last Name"
                                        name="lastname"
                                        autoComplete="lname"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="mobile_no"
                                        label="Mobile Number"
                                        name="mobile_no"
                                        autoComplete="mobile_no"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.mobile_no}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="cpassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="cpassword"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.cpassword}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="site-select-label">
                                            Sites
                                        </InputLabel>
                                        <Select
                                            labelId="site-select-label"
                                            id="site-select"
                                            value={values.site}
                                            onChange={handleChange("site")}
                                            label="Site"
                                        >
                                            {
                                                sites.map(row => <MenuItem value={row.value}>{row.label}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.formControl}
                                    >
                                        <InputLabel id="org-select-label">
                                            Org
                                        </InputLabel>
                                        <Select
                                            labelId="org-select-label"
                                            id="org-select"
                                            value={values.org}
                                            onChange={handleChange("org")}
                                            label="Org"
                                        >
                                            {
                                                orgs.map(row => <MenuItem value={row.value}>{row.label}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} >
                                    <Typography variant="body2">* All fields are required when creating your CBEWS-L Account</Typography>
                                    <Typography variant="body2">* Please review your details before submitting</Typography>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link
                                        href="#"
                                        variant="body2"
                                        onClick={() => handleChangeRoute("")}
                                    >
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
