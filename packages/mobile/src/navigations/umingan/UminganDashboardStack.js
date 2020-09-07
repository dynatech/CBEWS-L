import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import UminganDashboard from '../../components/umingan/UminganDashboard';
import RATabStack from '../umingan/RATabStack';
import FieldSurveyStack from '../umingan/FieldSurveyStack';
import SituationReportStack from '../umingan/SituationReportStack';
import ReportSummary from '../../components/umingan/reports/ReportSummary';

const Stack = createStackNavigator();

function UminganDashboardStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="UminganDashboard" options={{
                header: () => null
            }} component={UminganDashboard} />
            <Stack.Screen name="RATabStack" options={{
                title: 'Risk Assessment',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={RATabStack} />
            <Stack.Screen name="FieldSurvey" options={{
                title: 'Field Survey',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={FieldSurveyStack} />
            <Stack.Screen name="SituationReportStack" options={{
                title: 'Situation Report',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={SituationReportStack} />
            <Stack.Screen name="ReportSummary" options={{
                title: 'Reports',
                headerLeft: null,
                headerTitleStyle: {
                    textAlign: 'center',
                  },
            }} component={ReportSummary} />
        </Stack.Navigator>
    );
}

export default UminganDashboardStack;