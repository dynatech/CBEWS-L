import { StyleSheet } from 'react-native'
import {Dimensions} from 'react-native';
  
let {width} = Dimensions.get('window');
let {height} = Dimensions.get('window');

const ButtonStyle = StyleSheet.create({
   large: {
    backgroundColor: '#083451',
    borderColor: '#083451',
    borderRadius: 50,
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10
   },
   medium: {
      backgroundColor: '#083451',
      borderColor: '#083451',
      borderRadius: 50,
      borderWidth: 1,
      marginRight: 10,
      marginLeft: 10,
      width: width/2
   },
   small: {
      backgroundColor: '#083451',
      borderColor: '#083451',
      borderRadius: 50,
      borderWidth: 1,
      elevation: 10,
      marginRight: 10,
      marginLeft: 10,
      width: width/3
   },
   valid: {
      backgroundColor: 'green',
      borderColor: 'green',
      borderRadius: 50,
      borderWidth: 1,
      elevation: 10,
      marginRight: 10,
      marginLeft: 10,
      width: width/3
   },
   invalid: {
      backgroundColor: 'red',
      borderColor: 'red',
      borderRadius: 50,
      borderWidth: 1,
      elevation: 10,
      marginRight: 10,
      marginLeft: 10,
      width: width/3
   },
   extra_small: {
      backgroundColor: '#083451',
      borderColor: '#083451',
      borderRadius: 50,
      borderWidth: 1,
      elevation: 20,
      marginRight: 10,
      marginLeft: 10,
      width: width/4
   },
   large_text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
   },
   medium_text: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
      padding: 5
   },
   small_text: {

   }
})

export { ButtonStyle }