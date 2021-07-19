import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Dimensions } from 'react-native';
import ReportSummary from '../../components/umingan/field_survey/ReportSummary';
import FieldSurveyLogs from '../../components/umingan/field_survey/FieldSurveyLogs';

const Tab = createMaterialTopTabNavigator();

function FieldSurveyStack() {
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
            <Tab.Screen name="ReportSummary"
                component={ReportSummary} options={{
                    'tabBarLabel': 'Report Summary'
                }} />
            <Tab.Screen name="FieldSurveyLogs"
                component={FieldSurveyLogs} options={{
                    'tabBarLabel': 'Field Survey Logs'
                }} />
        </Tab.Navigator>
    );
}

export default FieldSurveyStack;