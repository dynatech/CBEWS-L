import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ForgotPassword from '../components/authentications//ForgotPassword';
import Signin from '../components/authentications/Signin';
import Signup from '../components/authentications/Signup';

const Stack = createStackNavigator();

function AuthStack() {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                header: () => null
            }}>
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthStack;