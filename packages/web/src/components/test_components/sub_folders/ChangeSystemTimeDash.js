import React, { useState } from "react";
import moment from "moment";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ServerDataGen } from "@dynaslope/commons";
import MomentUtils from '@date-io/moment';

export default function ChangeSystemTimeDash() {
  const [time, setTime] = useState(moment());

  function submitTime() {
    ServerDataGen.ChangeServerTime(moment, res => {
      console.log("res", res);
      if (res.status === 200) {
        alert("successfully changed time");
      }
    });
  }

  function changeTime (e) {
    console.log("e change", e);
    // setTime(e)
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align="center">
        <Paper>
          <Typography variant="h5">Change System Time of Server</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} align="right">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker 
                      autoOk
                      showTodayButton
                      value={time}
                      format="YYYY-MM-DD hh:mm:ss"
                      // inputValue={}
                      onChange={changeTime}
                    />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6} align="left">
              <Button variant="contained" color="primary" onClick={submitTime}>Change Time</Button>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
  )
}