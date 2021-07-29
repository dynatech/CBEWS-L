import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import CurrentSituationReport from '../../components/umingan/situation_report/CurrentSituationReport';
import SituationReportLogs from '../../components/umingan/situation_report/SituationReportLogs';

const Tab = createMaterialTopTabNavigator();

function SituationReportStack() {
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
            <Tab.Screen name="CurrentSituationReport"
                component={CurrentSituationReport} options={{
                    'tabBarLabel': 'Current Situation Report'
                }} />
            <Tab.Screen name="SituationReportLogs"
                component={SituationReportLogs} options={{
                    'tabBarLabel': 'Situation Report Logs'
                }} />
        </Tab.Navigator>
    );
}

export default SituationReportStack;