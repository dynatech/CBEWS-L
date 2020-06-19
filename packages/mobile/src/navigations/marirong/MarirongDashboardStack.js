
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MarirongDashboard from '../../components/marirong/MarirongDashboard';
import CRATabStack from '../marirong/CRATabStack';
import MaintenanceLogsTabStack from '../marirong/MaintenanceLogsTabStack';

const Stack = createStackNavigator();

function MarirongDashboardStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="MarirongDashboard" options={{
                header: () => null
            }} component={MarirongDashboard} />
            <Stack.Screen name="CRATabStack" options={{
                title: 'Community Risk Assessment',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={CRATabStack} />
            <Stack.Screen name="MaintenanceLogsTabStack" options={{
                title: 'Maintenance Logs',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={MaintenanceLogsTabStack} />
        </Stack.Navigator>
    );
}

// <Stack.Screen name="CRA" options={{
//     title: 'Community Risk Assessment'
// }} component={CRA} />
// <Stack.Screen name="AlertGen"  options={{
//     title: 'Alert Generation'
// }} component={AlertGen} />
// <Stack.Screen name="DataAnalysis"  options={{
//     title: 'Data Analysis'
// }} component={DataAnalysis} />
// <Stack.Screen name="GroundData"  options={{
//     title: 'Ground Data'
// }} component={GroundData} />
// <Stack.Screen name="SensorData"  options={{
//     title: 'Sensor Data'
// }} component={SensorData} />
// <Stack.Screen name="Maintenance"  options={{
//     title: 'Maintenance'
// }} component={Maintenance} />
// <Stack.Screen name="DataSync"  options={{
//     title: 'Data Sync'
// }} component={DataSync} />

export default MarirongDashboardStack;