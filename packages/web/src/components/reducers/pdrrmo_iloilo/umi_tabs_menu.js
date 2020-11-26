import React, { useState, Fragment } from 'react';
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
import UmiContent from './umi_body'
import CRA from '../components/umi/cra';

export default function UmiTabsMenu() {
  const [value, setValue] = useState("umi_cra");
  const [body, setBody] = useState([<CRA />]);

  const handleChange = (event, app_module) => {
    let content = [<UmiContent app_key={app_module} />]
    setValue(app_module);
    setBody(content)
  };

  return (
    <Fragment>
      <Box style={{ paddingTop: 100}}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            centered
          >
            <Tab value={"umi_cra"} label="Community Risk Assessment" />
            <Tab value={"umi_alertStatus"} label="Early Warning Information" />
            <Tab value={"umi_sensorData"} label="Sensor Data" />
            <Tab value={"umi_groundData"} label="Ground Data" />
            <Tab value={"umi_reports"} label="Reports" />
            <Tab value={"umi_maintenance"} label="Maintenance" />
          </Tabs>
        </Paper>
        <Box style={{ marginTop: 2, marginBottom: 10 }}>
          {body}
        </Box>
      </Box>
    </Fragment>
  );
}