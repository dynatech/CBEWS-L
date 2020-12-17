import React from "react";
import { Grid, Link, Typography } from "@material-ui/core";
import { useCookies } from "react-cookie";

export default function ForgotPassword (props) {  
    const [cookies] = useCookies(["credentials"]);
    const is_logged_out = cookies.credentials === undefined ? true : false;
    return (
        <Grid container>
            <Grid xs={12}>
                <Typography variant="h2">
                    Forgot Password is still in the works. :((
                </Typography>
                {is_logged_out && (
                    <Typography>
                        {"We will return to sign in for the mean time. "}
                        <Link onClick={() => props.history.push("/signin")}>
                            Return to Sign In
                        </Link>
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
}