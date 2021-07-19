import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import RiskAssessmentSummary from '../../components/umingan/risk_assessment/RiskAssessmentSummary';
import HazardData from '../../components/umingan/risk_assessment/HazardData';
import ResourcesNCapacities from '../../components/umingan/risk_assessment/ResourcesNCapacities';
import Maps from '../../components/umingan/risk_assessment/Maps';
import FamilyRiskProfile from '../../components/umingan/risk_assessment/FamilyRiskProfile';
import { BackHandler } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function RATabStack() {
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
                }
            }}>
            <Tab.Screen name="RiskAssessmentSummary"
                component={RiskAssessmentSummary} options={{
                    'tabBarLabel': 'Summary'
                }} />
            <Tab.Screen name="HazardData"
                component={HazardData} options={{
                    'tabBarLabel': 'Hazard Data'
                }} />
            <Tab.Screen name="ResourcesNCapacities"
                component={ResourcesNCapacities} options={{
                    'tabBarLabel': 'Resources and Capacities'
                }} />
            <Tab.Screen name="Maps"
                component={Maps} options={{
                    'tabBarLabel': 'Maps'
                }} />
            <Tab.Screen name="FamilyRiskProfile"
                component={FamilyRiskProfile} options={{
                    'tabBarLabel': 'Family Risk Profile'
                }} />
        </Tab.Navigator>
    );
}

export default RATabStack;