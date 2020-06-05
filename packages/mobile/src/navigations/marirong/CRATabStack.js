import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import CommunityRiskAssessment from '../../components/marirong/community_risk_assessment/CommunityRiskAssessment';
import HazardMapping from '../../components/marirong/community_risk_assessment/HazardMapping';
import CapacityAndVulnerability from '../../components/marirong/community_risk_assessment/CapacityAndVulnerability';

const Tab = createMaterialTopTabNavigator();

function CRATabStack() {
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
                    justifyContent: 'center',
                }
            }}>
            <Tab.Screen name="HazardMapping"
                component={HazardMapping} options={{
                    'tabBarLabel': 'Hazard Mapping'
                }} />
            <Tab.Screen name="CapacityAndVulnerability"
                component={CapacityAndVulnerability} options={{
                    'tabBarLabel': 'Capacity and Vulnerability'
                }} />
            <Tab.Screen name="CommunityRiskAssessment"
                component={CommunityRiskAssessment} options={{
                    'tabBarLabel': 'Community Risk Assessment'
                }} />
        </Tab.Navigator>
    );
}

export default CRATabStack;