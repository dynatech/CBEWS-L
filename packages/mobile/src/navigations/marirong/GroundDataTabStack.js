import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import MoMs from '../../components/marirong/ground_data/MoMs';
import SurficialMarkers from '../../components/marirong/ground_data/SurficialMarkers';
import OnDemandSurficial from '../../components/marirong/ground_data/OnDemandSurficial';

const Tab = createMaterialTopTabNavigator();

function GroundDataTabStack() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    return (
        <Tab.Navigator
            lazyLoad={true}
            tabBarPosition='bottom'
            tabBarOptions={{
                inactiveTintColor: 'white',
                activeTintColor: '#f5981c',
                scrollEnabled: true,
                style: { backgroundColor: '#083451' },
                tabStyle: {
                    width: screenWidth/2.5
                },
            }}>
            <Tab.Screen name="MoMs"
                component={MoMs} options={{
                    'tabBarLabel': 'Manifestation of Movements'
                }} />
            <Tab.Screen name="SurficialMarkers"
                component={SurficialMarkers} options={{
                    'tabBarLabel': 'Surficial Markers'
                }} />
            <Tab.Screen name="OnDemandSurficial"
                component={OnDemandSurficial} options={{
                    'tabBarLabel': 'On-Demand Monitoring'
                }} />
        </Tab.Navigator>
    );
}

export default GroundDataTabStack;