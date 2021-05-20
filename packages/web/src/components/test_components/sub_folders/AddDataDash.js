import React, { useState } from "react";
import moment from "moment";
import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ServerDataGen } from "@dynaslope/commons";
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const lookUpTable = {
  "rainfall": {
    "nd": "nd",
    0: "r0",
    1: "R | r1",
  },
  "surficial": {
    "nd": "ND",
    0: "g/G | l0",
    2: "g | l2",
    3: "G | l3",
  },
  "subsurface": {
    "nd": "ND",
    0: "s/S | L0",
    2: "s | L2",
    3: "S | L3",
  }
}

export default function ChangeSystemTimeDash(props) {
  const classes = useStyles();
  const [triggerType, setTriggerType] = useState('');
  const [status, setStatus] = useState('');

  const [rainfallData, setRainfallData] = useState({
    "rainfall_ts_start": "",
    "rainfall_ts_end": "",
    "status": "",
    "site_id": props.site_id,
    "internal_alert": ""
  });
  
  // actual marker data should be handled by backend, using the existing markers.
  const [surficialData, setSurficialData] = useState({
    "surficial_ts": "",
    "status": "",
    "site_id": props.site_id,
    "internal_alert": ""
  });
  
  // actual marker data should be handled by backend, using the existing markers.
  const [subsurfaceData, setSubsurfaceData] = useState({
    "subsurface_ts": "",
    "status": "",
    "site_id": props.site_id,
    "internal_alert": ""
  });

  function submitTime() {
    ServerDataGen.ChangeServerTime(moment, res => {
      console.log("res", res);
      if (res.status === 200) {
        alert("successfully changed time");
      }
    });
  }

  function handleChange(e) {
    setTriggerType(e.target.value);
  };

  function handleStatusChange(e) {
    setStatus(e.target.value);
    const ia = lookUpTable[triggerType][e.target.value];
    switch (triggerType) {
      case "rainfall":
        setRainfallData({...rainfallData, internal_alert: ia})
        break;
      case "surficial":
        setSurficialData({...surficialData, internal_alert: ia})
        break;
      case "subsurface":
        setSubsurfaceData({...subsurfaceData, internal_alert: ia})
        break;
      default:
        break;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} align="center">
        <Paper>
          <Typography variant="h5">Adding Data for Testing</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6} align="right">
            <FormControl className={classes.formControl}>
              <InputLabel>Trigger Type</InputLabel>
              <Select
                labelId="label-trigger-type-select"
                id="trigger-type-select"
                value={triggerType}
                onChange={handleChange}
              >
                <MenuItem value={'rainfall'}>Rainfall</MenuItem>
                <MenuItem value={'surficial'}>Surficial</MenuItem>
                <MenuItem value={'subsurface'}>Subsurface</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} align="left">
            <FormControl className={classes.formControl}>
              <InputLabel>Status</InputLabel>
              <Select
                labelId="label-status-select"
                id="status-select"
                value={status}
                onChange={handleStatusChange}
              >
                <MenuItem value={'nd'}>no data</MenuItem>
                <MenuItem value={0}>non-triggering</MenuItem>
                <MenuItem value={1} disabled={["surficial", "subsurface"].includes(triggerType)}>A1 trigger</MenuItem>
                <MenuItem value={2} disabled={triggerType === "rainfall"}>A2 trigger</MenuItem>
                <MenuItem value={3} disabled={triggerType === "rainfall"}>A3 trigger</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{ margin: "2%"}}>
            {/* BODY */}
            {
              triggerType === "rainfall" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Adding Rainfall Trigger</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="rain_ts_start" label="Rainfall Start"
                      helperText="Should be interval of 30mins e.g. xx:00 or xx:30"
                      variant="outlined" fullWidth
                      value={rainfallData.rainfall_ts_start} onChange={e => setRainfallData({...rainfallData, rainfall_ts_start: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="rain_ts_end" label="Rainfall End"
                      helperText="Should be interval of 30mins e.g. xx:00 or xx:30"
                      variant="outlined" fullWidth
                      value={rainfallData.rainfall_ts_end} onChange={e => setRainfallData({...rainfallData, rainfall_ts_end: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="rain_ia" label="Internal Alert Symbol"
                      variant="outlined" fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      value={rainfallData.internal_alert} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="secondary" style={{ height: "55px"}} onClick={()=>alert("WIP")}>Submit</Button>
                  </Grid>
                </Grid>
              )
            }
            {
              triggerType === "surficial" && (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Adding Surficial Trigger</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="surficial_ts" label="Surficial Observation Timestamp"
                      helperText="Time of supposed to be ground measurement"
                      variant="outlined" fullWidth
                      value={surficialData.surficial_ts} onChange={e => setSurficialData({...surficialData, surficial_ts: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="surficial_ia" label="Internal Alert Symbol"
                      variant="outlined" fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      value={surficialData.internal_alert} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="secondary" style={{ height: "55px"}} onClick={()=>alert("WIP")}>Submit</Button>
                  </Grid>
                </Grid>
              )
            }
            {
              triggerType === "subsurface" && (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Adding Subsurface Trigger</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="subsurface_ts" label="Subsurface Timestamp"
                      helperText="Should be interval of 30mins e.g. xx:00 or xx:30"
                      variant="outlined" fullWidth
                      value={subsurfaceData.subsurface_ts} onChange={e => setSubsurfaceData({...subsurfaceData, subsurface_ts: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="subsurface_ia" label="Internal Alert Symbol"
                      variant="outlined" fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      value={subsurfaceData.internal_alert} 
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="secondary" style={{ height: "55px"}} onClick={()=>alert("WIP")}>Submit</Button>
                  </Grid>
                </Grid>
              )
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}