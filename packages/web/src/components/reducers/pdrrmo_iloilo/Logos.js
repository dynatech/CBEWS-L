import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography, Box } from '@material-ui/core/';

const login_styles = {
    media: {
        height: 200,
        width: 200
    }
};

const img_styles = {
    media: {
        height: 75,
        width: 75
    }
};

function LogoCenter() {

    return (
        <Container style={{ margin: 20 }}>
            <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item xs={3}>
                    <CardMedia
                        image={require('../../../assets/dost_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>
                <Grid item xs={3}>
                    <CardMedia
                        image={require('../../../assets/dynaslope_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>

                <Grid item xs={3}>
                    <CardMedia
                        image={require('../../../assets/plgu_logo.png')}
                        style={login_styles.media}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

function LogoAppBar() {
    function changeLogoAppBar(site) {
        let ret_val = [];
        if (site === "/umi") {
            ret_val = [
                <Grid container spacing={4} align="center" justify="center">
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dost_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dynaslope_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <Box fontSize={35} fontFamily="Arial">
                            Republic of the Philippines
                        </Box>
                        <Box borderTop={2} style={{ borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%', borderTopRightRadius: '50%', borderBottomRightRadius: '50%' }} borderColor="#000" />
                        <Box fontSize={20} fontFamily="Arial">
                            Provincial Disaster Risk Reduction Management
                        </Box>
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/plgu_logo.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/umi_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                </Grid>
            ]
        } else if (site === "/mar") {
            ret_val = [
                <Grid container spacing={2} align="center">
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dost_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dynaslope_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Box fontSize={35} fontFamily="Arial">
                            Republic of the Philippines
                        </Box>
                        <Box borderTop={2} style={{ borderTopRightRadius: '50%', borderBottomRightRadius: '50%' }} borderColor="#000" />
                        <Box fontSize={20} fontFamily="Arial">
                            Provincial Disaster Risk Reduction Management
                        </Box>
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/plgu_logo.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/mar_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                </Grid>
            ]
        } else {
            ret_val = [
                <Grid container spacing={2} >
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dost_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/dynaslope_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={6}>
                        <Box fontSize={35} fontFamily="Arial">
                            Republic of the Philippines
                        </Box>
                        <Box borderTop={2} style={{ borderRadius: '50%' }} borderColor="#000" />
                        <Box fontSize={20} fontFamily="Arial">
                            Provincial Disaster Risk Reduction Management
                        </Box>
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/plgu_logo.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/mar_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <CardMedia
                            image={require('../../../assets/umi_seal.png')}
                            style={img_styles.media}
                        />
                    </Grid>
                </Grid>
            ]
        }
        return ret_val;
    }

    return (
        <Fragment >
            <Container style={{ margin: 10 }} >
                {changeLogoAppBar(window.location.pathname)}
            </Container>
        </Fragment>
    );
}

export {
    LogoCenter, LogoAppBar
}
