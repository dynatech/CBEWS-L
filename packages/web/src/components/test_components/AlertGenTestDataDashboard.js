import React, { Fragment, useEffect, useState } from "react";
import { Container, Grid, Paper, Tab, Tabs } from "@material-ui/core";
import AddDataDash from "./sub_folders/AddDataDash"
import ChangeSystemTimeDash from "./sub_folders/ChangeSystemTimeDash"
import TruncateDataDash from "./sub_folders/TruncateDataDash"

export default function AlertGenTestDataDashboard () {
  const [value, setValue] = useState(0);
  const [component, setComponent] = useState(<AddDataDash />)

  const handleChange = (event, newValue) => {
    event.preventDefault();
    console.log(newValue)
    setValue(newValue);
    switch(newValue) {
      case 0:
        setComponent(<AddDataDash />)
        break;
      case 1:
        setComponent(<TruncateDataDash />)
        break;
      case 2:
        setComponent(<ChangeSystemTimeDash />)
        break;
      default:
        return []
    }
  };

  return (
    <Container style={{ marginTop: "2%"}}>
      <Grid container>
        {/* Title */}
        <Grid item xs={12}>
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Add Data" />
              <Tab label="Truncate Data" />
              <Tab label="Change 
              System Time" />
            </Tabs>
          </Paper>
        </Grid>
        {/* Tab Menu */}
        <Grid item xs={12}>
          <Paper square>
            {
              component
            }
          </Paper>
        </Grid>
      </Grid>
      </Container>
  );
}