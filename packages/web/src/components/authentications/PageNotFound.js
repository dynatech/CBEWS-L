import React from "react";
import { Grid, Link, Typography, Button, Card } from "@material-ui/core";
import { useCookies } from "react-cookie";

export default function PageNotFound(props) {
    const [cookies] = useCookies(["credentials"]);
    const is_logged_out = cookies.credentials === undefined ? true : false;
    console.log("is_logged_out", is_logged_out);
    return (               
        <Grid container>
        {window.location.pathname !== "/dashboard" &&
            (
            <Grid xs={12}>
                <Typography variant="h2">
                    {"We cannot find what you are looking for :("}
                </Typography>
                {    
                    is_logged_out ?
                    (
                        <Typography>
                            {"You are currently logged out. Please "}
                            <Link onClick={() => props.history.push("/signin")}>
                                Sign In
                            </Link>
                        </Typography>
                    ):(
                        <Typography>
                            {"Back to "}
                            <Link onClick={() => props.history.push("/dashboard")}>
                                Dashboard
                            </Link>
                        </Typography>
                    )              
                }
            </Grid>
            )
        }
        </Grid>
        
    
    );
}
