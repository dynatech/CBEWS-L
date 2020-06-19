import React from 'react';
import { Dimensions } from 'react-native';
import MaintenanceLogs from '../../components/marirong/maintenance_logs/MaintenanceLogs';
import IncidentLogs from '../../components/marirong/maintenance_logs/IncidentLogs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MaintenanceLogsTabStack() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    return (
        <Tab.Navigator
            lazyLoad={true}
            tabBarPosition='bottom'
            tabBarOptions={{
                inactiveTintColor: 'white',
                activeTintColor: '#f5981c',
                scrollEnabled: true,
                style: { backgroundColor: '#083451'},
                tabStyle: {
                    width: screenWidth/2
                },
            }}>
            <Tab.Screen name="MaintenanceLogs"
                component={MaintenanceLogs} options={{
                    'tabBarLabel': 'Maintenance Logs'
                }} />
            <Tab.Screen name="IncidentLogs"
                component={IncidentLogs} options={{
                    'tabBarLabel': 'Incident Logs'
                }} />
        </Tab.Navigator>
    );
}

export default MaintenanceLogsTabStack;