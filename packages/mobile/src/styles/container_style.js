import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native';

let { width } = Dimensions.get('window');
let { height } = Dimensions.get('window');

const ContainerStyle = StyleSheet.create({
     header: {
          backgroundColor: '#083451',
          alignItems: 'center',
          padding: '3.1%'
     },
     content: {
          // flex: 1,
          width: '100%',
          alignContent: 'center',
          // margin: '5%'
          marginTop: '5%',
          marginBottom: '5%'
     },
     login_content: {
          flex: 1,
     },
     dashboard_content: {
          flex: 2.5
     },
     dashboard_menu: {
          flex: 1,
     },
     datatable_content: {
          flex: 0.5
     },
     input_label_combo: {
          // flexDirection: 'row'
          padding: 10
     },
     menu_row: {
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-around',
          marginBottom: height * 0.03,
     },
     seals: {
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
     },
     weather_container: {
          alignItems: 'center',
          paddingBottom: height * 0.03
     },
     menu_container: {
          textAlign: 'center',
     },
     hr: {
       borderColor: '#083451',
       borderRadius: 10,
       borderBottomWidth: 2,
       paddingBottom: 5
     }
})

export { ContainerStyle }