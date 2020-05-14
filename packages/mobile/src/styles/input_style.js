import { StyleSheet } from 'react-native'
import {Dimensions} from 'react-native';
  
let {width} = Dimensions.get('window');
let {height} = Dimensions.get('window');

const InputStyle = StyleSheet.create({
    large: {
        margin: 10,
        color: '#000',
        borderBottomWidth: 3,
    },
    medium: {
        marginLeft: 10,
        marginRight: 10,
        color: '#000',
        borderBottomWidth: 3,
    },
    small: {
        marginLeft: 10,
        marginRight: 10,
    },
    default: {
        borderBottomWidth: 3,
        borderBottomColor: '#083451',
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 5,
        elevation: 2,
    },
    disabled: {
        backgroundColor: '#9c9c9c'
    },
    success: {

    },
    error: {

    },
    white: {
        color: '#fff',
    },
    dyna_yellow: {
        color: '#f5981c'
    },
    black: {
        color: '#000'
    }
})

export { InputStyle }