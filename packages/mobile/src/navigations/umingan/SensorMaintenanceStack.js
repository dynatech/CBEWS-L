import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import SensorGraphs from '../../components/umingan/sensor_maintenance/SensorGraphs';
import SensorMaintenanceLogs from '../../components/umingan/sensor_maintenance/SensorMaintenanceLogs';
import SensorSummary from '../../components/umingan/sensor_maintenance/SensorSummary';

const Tab = createMaterialTopTabNavigator();

function SensorMaintenanceStack() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    return (
        <Tab.Navigator
            lazyLoad={true}
            tabBarPosition='bottom'
            backBehavior='initialRoute'
            tabBarOptions={{
                inactiveTintColor: 'white',
                activeTintColor: '#f5981c',
                scrollEnabled: true,
                style: { backgroundColor: '#083451'},
                tabStyle: {
                    justifyContent: 'center',
                    width: screenWidth/2
                }
            }}>
            <Tab.Screen name="SensorSummary"
                component={SensorSummary} options={{
                    'tabBarLabel': 'Sensor Report Summary'
                }} />
            <Tab.Screen name="SensorMaintenanceLogs"
                component={SensorMaintenanceLogs} options={{
                    'tabBarLabel': 'Sensor Maintenance Logs'
                }} />
            <Tab.Screen name="SensorGraphs"
                component={SensorGraphs} options={{
                    'tabBarLabel': 'Rainfall and Subsurface Graphs'
                }} />
        </Tab.Navigator>
    );
}

export default SensorMaintenanceStack;