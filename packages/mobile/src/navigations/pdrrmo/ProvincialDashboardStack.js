import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

function ProvincialDashboardStack() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Signin" options={{
                    header: () => null
                }} component={Signin} />
                <Stack.Screen name="Signup" options={{
                    title: 'Account Registration'
                }} component={Signup} />
                <Stack.Screen name="ForgotPassword"  options={{
                    title: 'Forgot Password'
                }} component={ForgotPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default ProvincialDashboardStack;