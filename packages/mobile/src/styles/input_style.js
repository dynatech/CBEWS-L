import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const InputStyle = StyleSheet.create({
    large: {
        color: '#000',
        borderBottomWidth: 3,
        margin: 10
    },
    medium: {
        margin: 10,
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
    form_input_large: {
        textAlign: 'center',
        width: '100%'
    },
    form_input_medium: {
        textAlign: 'center',
        width: '80%'
    },
    form_input_small: {
        textAlign: 'center',
        width: '50%'
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
        borderBottomColor: '#f5981c',
        textAlign: 'center',
        padding: 0
    },
    black: {
        color: '#000'
    }
})

export { InputStyle }