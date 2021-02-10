import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import CurrentAlerts from '../../components/marirong/ewi/CurrentAlerts';
import AlertValidation from '../../components/marirong/ewi/AlertValidation';

const Tab = createMaterialTopTabNavigator();

function AlertGenerationStack() {
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
                }
            }}>
            <Tab.Screen name="AlertValidation"
                component={AlertValidation} options={{
                    'tabBarLabel': 'Alert Validation'
                }} />
            <Tab.Screen name="CurrentAlerts"
                component={CurrentAlerts} options={{
                    'tabBarLabel': 'Latest Current Alert'
                }} />
        </Tab.Navigator>
    );
}

export default AlertGenerationStack;