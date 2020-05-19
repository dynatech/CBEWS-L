import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import UminganDashboard from '../../components/umingan/UminganDashboard';

const Stack = createStackNavigator();

function UminganDashboardStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="UminganDashboard" options={{
                header: () => null
            }} component={UminganDashboard} />
        </Stack.Navigator>
    );
}

export default UminganDashboardStack;