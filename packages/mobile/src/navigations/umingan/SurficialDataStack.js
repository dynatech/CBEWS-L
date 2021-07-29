import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import ManifestationOfMovements from '../../components/umingan/surficial_data/ManifestationOfMovements';
import SurficialData from '../../components/umingan/surficial_data/SurficialData';
import SurficialSummary from '../../components/umingan/surficial_data/SurficialSummary';

const Tab = createMaterialTopTabNavigator();

function SurficialDataStack() {
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
            <Tab.Screen name="SurficialSummary"
                component={SurficialSummary} options={{
                    'tabBarLabel': 'Surficial Data Summary'
                }} />
            <Tab.Screen name="SurficialData"
                component={SurficialData} options={{
                    'tabBarLabel': 'Surficial Markers Data'
                }} />
            <Tab.Screen name="ManifestationOfMovements"
                component={ManifestationOfMovements} options={{
                    'tabBarLabel': 'Manifestation of Movements'
                }} />
        </Tab.Navigator>
    );
}

export default SurficialDataStack;