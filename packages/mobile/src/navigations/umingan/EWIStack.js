import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import CurrentAlerts from '../../components/umingan/ewi/CurrentAlerts';
import AlertValidation from '../../components/umingan/ewi/AlertValidation';

const Tab = createMaterialTopTabNavigator();

function EWIStack() {
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
                    width: screenWidth/2
                }
            }}>
            <Tab.Screen name="CurrentAlerts"
                component={CurrentAlerts} options={{
                    'tabBarLabel': 'Current Alerts'
                }} />
            <Tab.Screen name="AlertValidation"
                component={AlertValidation} options={{
                    'tabBarLabel': 'Alert Validation'
                }} />
        </Tab.Navigator>
    );
}

export default EWIStack;