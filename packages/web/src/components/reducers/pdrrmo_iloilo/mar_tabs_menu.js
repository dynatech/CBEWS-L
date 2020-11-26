import React, { useState, Fragment } from 'react';
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
import MarContent from './mar_body'
import CRA from '../components/mar/cra';

export default function MarTabsMenu() {
  const [value, setValue] = useState("mar_cra");
  const [body, setBody] = useState([<CRA/>]);

  const handleChange = (event, app_module) => {
    let content = [<MarContent app_key={app_module} />]
    setValue(app_module);
    setBody(content)
  };

  return (
    <Fragment>
      <Box style={{ paddingTop: 100 }}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            centered
          >
            <Tab value={"mar_cra"} label="Community Risk Assessment" />
            <Tab value={"mar_alertStatus"} label="Early Warning Information" />
            <Tab value={"mar_sensorData"} label="Sensor Data" />
            <Tab value={"mar_groundData"} label="Ground Data" />
            <Tab value={"mar_reports"} label="Reports" />
            <Tab value={"mar_maintenance"} label="Maintenance" />
          </Tabs>
        </Paper>
        <Box style={{ marginTop: 10, marginBottom: 10 }}>
          {body}
        </Box>
      </Box>
    </Fragment>
  );
}