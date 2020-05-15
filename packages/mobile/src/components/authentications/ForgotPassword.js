import React, { Fragment } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';

function ForgotPassword () {
    return (
      <Fragment>
        <View style={[ContainerStyle.content, {justifyContent: 'center'}]}>
          <Text style={[LabelStyle.medium_label, {textAlign: 'center'}]}>Please enter your username or phone number to reset your account password</Text>
          <View style={{ alignItems: 'center', paddingTop: 20 }}>
            <Input placeholder="E.g. JuanDelaCruz"
            label="Username / Mobile No."
            containerStyle={{ width: '80%', borderColor: '#f5981c' }}
            inputStyle={{textAlign: 'center', padding: 0}} />
          </View>
          <Text style={[LabelStyle.medium_label, {textAlign: 'center'}]}>A new password will be sent to your mobile number via SMS.</Text>
        </View>
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={ButtonStyle.medium}>
                <Text style={ButtonStyle.medium_text}>Submit</Text>
            </TouchableOpacity>
        </View>
      </Fragment>
    );

}

export default ForgotPassword;