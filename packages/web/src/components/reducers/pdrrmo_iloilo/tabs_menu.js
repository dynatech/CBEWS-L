import React, { useState, Fragment } from 'react';
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
// import UmiContent from './umi_body'
import CRA from '../components/merged/cra';
import Content from './body';

export default function TabsMenu() {
  const [value, setValue] = useState("cra");
  const [body, setBody] = useState([<CRA/>]);

  const handleChange = (event, app_module) => {
    let content = [<Content app_key={app_module} />]
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
            <Tab value={"cra"} label="Community Risk Assessment" />
            <Tab value={"alertStatus"} label="Early Warning Information" />
            <Tab value={"sensorData"} label="Sensor Data" />
            <Tab value={"groundData"} label="Ground Data" />
            <Tab value={"reports"} label="Reports" />
            <Tab value={"maintenance"} label="Maintenance" />
          </Tabs>
        </Paper>
        <Box style={{ marginTop: 2, marginBottom: 10 }}>
          {body}
        </Box>
      </Box>
    </Fragment>
  );
}