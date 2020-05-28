import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { Input } from 'react-native-elements';
import { ButtonStyle } from '../../styles/button_style';
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { Formik } from 'formik';

const Forms = (props) => {
    const { data, closeForm } = props;
    const { string, int, api } = data;

    const [defaultValues, setDefaultValues] = useState({});

    useEffect(()=> {
        setDefaultValues(Object.assign(string, int));
    },[])

    return(
        <ScrollView style={[ContainerStyle.content]}>
        <Formik
            initialValues={defaultValues}
            onSubmit={values => {
                // API GO HERE
                console.log(defaultValues);
                console.log(values);
                closeForm();
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                    {   
                        Object.entries(defaultValues).map((e, l) => {
                            let key = e[0].replace(/\s/g, "");
                            return(
                                <Input 
                                key={e[0]}
                                label={e[0]}
                                value={values[`${key}`]}
                                containerStyle={{ width: '80%', borderColor: '#f5981c' }}
                                inputStyle={{ textAlign: 'center', padding: 0 }}
                                onChangeText={handleChange(`${key}`)} />
                            )
                        })
                     }
                    <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 25 }}>
                        <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* All fields are required</Text>
                        <Text style={[LabelStyle.small_label, { textAlign: 'center' }]}>* Please review your details before submitting</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={ButtonStyle.medium} onPress={handleSubmit}>
                            <Text style={ButtonStyle.medium_text}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
        </ScrollView>
    )
}

export default Forms;