import React from 'react';
import { LogoAppBar } from '../pdrrmo_iloilo/Logos'
import { AppBar, Toolbar, IconButton, 
    Drawer, List, Divider, 
    ListItem, ListItemText, makeStyles, Typography, Container, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  });


function Header(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
          className={classes.list}
          role="presentation"
          onClick={toggleDrawer(side, false)}
          onKeyDown={toggleDrawer(side, false)}
        >
          <List>
            {['Home','Profile', 'Notifications', ].map((text, index) => (
              <ListItem button key={text} onClick={()=> {goHomePage(text)}}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Logout'].map((text, index) => (
              <ListItem button key={text} onClick={()=> {goHomePage(text)}}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      );
    
    function goHomePage(tab) {
      if (tab === "Home") {
        props.history.push(`/dashboard`);
      } else if (tab === "Logout") {
        props.history.push(`/`);
      }
    }

    return (
        <div>
            <AppBar position="fixed" color="inherit">
                <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
                    <MenuIcon />
                  </IconButton>
                    <Container>
                      <Grid container align="center">
                        <Grid item xs={12}>
                        <LogoAppBar />
                        </Grid>
                      </Grid>
                    </Container>
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
        </div>
    );
}


export default Header