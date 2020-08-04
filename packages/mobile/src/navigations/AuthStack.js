import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ForgotPassword from '../components/authentications/ForgotPassword';
import Signin from '../components/authentications/Signin';
import Signup from '../components/authentications/Signup';
import MarirongDashboardStack from '../navigations/marirong/MarirongDashboardStack';
import UminganDashboardStack from '../navigations/umingan/UminganDashboardStack';

const Stack = createStackNavigator();

function AuthStack() {
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
                <Stack.Screen name="MarirongDashboardStack"  options={{
                    header: () => null
                }} component={MarirongDashboardStack} />
                <Stack.Screen name="UminganDashboardStack"  options={{
                    header: () => null
                }} component={UminganDashboardStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthStack;