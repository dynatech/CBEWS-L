import React from 'react';
import { LogoCenter } from '../../reducers/pdrrmo_iloilo/Logos';
import AppTitle from '../../reducers/pdrrmo_iloilo/AppTitle';
import { Container, Grid, TextField, Button } from '@material-ui/core/';


function SigninIloilo(props) {

    function validateCredentials() {
        props.history.push({
            pathname: '/dashboard'
        });
    }
    
    return (
        <Container>
            <LogoCenter />
            <AppTitle />
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4}>
                    <TextField
                        id="username"
                        label="Username"
                        placeholder="E.g. JuanDelaCruz"
                        margin="normal"
                        fullWidth
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        InputLabelProps={{
                            style: { width: '100%', textAlign: 'center' }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4}>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        fullWidth
                        inputProps={{
                            style: { textAlign: "center" }
                        }}
                        InputLabelProps={{
                            style: { width: '100%', textAlign: 'center' }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4} align="center">
                    <Button variant="contained"
                        color="primary"
                        size="large"
                        style={{ margin: 20 }}
                        onClick={() => { validateCredentials() }}>
                        Signin
                        </Button>
                </Grid>
            </Grid>
        </Container>
    )

}

export default SigninIloilo