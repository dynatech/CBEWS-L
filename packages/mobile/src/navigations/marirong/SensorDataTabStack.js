import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import RainfallInstantaneous from '../../components/marirong/sensor_data/RainfallInstantaneous';
import SubsurfaceDisplacement from '../../components/marirong/sensor_data/SubsurfaceDisplacement';
import EarthquakeData from '../../components/marirong/sensor_data/EQ';

const Tab = createMaterialTopTabNavigator();

function SensorDataStack() {
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
                    justifyContent: 'center',
                    width: screenWidth/2
                }
            }}>
            <Tab.Screen name="RainfallInstantaneous"
                component={RainfallInstantaneous} options={{
                    'tabBarLabel': 'Rainfall Plot Summary'
                }} />
            <Tab.Screen name="SubsurfaceDisplacement"
                component={SubsurfaceDisplacement} options={{
                    'tabBarLabel': 'Subsurface Plot Summary'
                }} />
            <Tab.Screen name="EarthquakeData"
                component={EarthquakeData} options={{
                    'tabBarLabel': 'Surficial Plot Summary'
                }} />
        </Tab.Navigator>
    );
}

export default SensorDataStack;