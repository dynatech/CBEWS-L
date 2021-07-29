import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import RainfallPlot from '../../components/marirong/data_analysis/RainfallPlot';
import SubsurfacePlot from '../../components/marirong/data_analysis/SubsurfacePlot';
import SurficialPlot from '../../components/marirong/data_analysis/SurficialPlot';

const Tab = createMaterialTopTabNavigator();

function DataAnalysisStack() {
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
            <Tab.Screen name="RainfallPlot"
                component={RainfallPlot} options={{
                    'tabBarLabel': 'Rainfall Plot Summary'
                }} />
            {/* <Tab.Screen name="SubsurfacePlot"
                component={SubsurfacePlot} options={{
                    'tabBarLabel': 'Subsurface Plot Summary'
                }} /> */}
            <Tab.Screen name="SurficialPlot"
                component={SurficialPlot} options={{
                    'tabBarLabel': 'Surficial Plot Summary'
                }} />
        </Tab.Navigator>
    );
}

export default DataAnalysisStack;