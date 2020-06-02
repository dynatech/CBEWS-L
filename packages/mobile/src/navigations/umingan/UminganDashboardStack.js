import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import UminganDashboard from '../../components/umingan/UminganDashboard';
import RATabStack from '../umingan/RATabStack';

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
        </Stack.Navigator>
    );
}

export default UminganDashboardStack;