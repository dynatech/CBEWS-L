import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { ContainerStyle } from '../../styles/container_style';
import { LabelStyle } from '../../styles/label_style';
import { ButtonStyle } from '../../styles/button_style';
import { InputStyle } from '../../styles/input_style';

function CommunityRiskAssessment() {
    const list = [];
    const [confirmUpload, setConfirmUpload] = useState(false);

    const confirmedUpload = () => {

    }

    const uploadFile = () => {

    }

    const downloadFile = (file) => {

    }

    return (
        <View style={ContainerStyle.content}>
            <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Community Risk Assessment</Text>
            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Reports and Documents</Text>
            <ScrollView>
                {
                    list.map((l) => (
                        <ListItem
                            key={l.filename}
                            title={l.filename}
                            subtitle={l.file_type.toUpperCase() + " FILE"}
                            hideChevron={true}
                        />
                    ))
                }
            </ScrollView>
            <View style={{ paddingTop: '10%', alignItems: 'center' }}>
                <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Selected file: test</Text>
                {confirmUpload ?
                    <TouchableOpacity style={ButtonStyle.medium} onPress={confirmedUpload}>
                        <Text style={ButtonStyle.large_text}>Confirm Upload</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={ButtonStyle.medium} onPress={uploadFile}>
                        <Text style={ButtonStyle.large_text}>Upload file</Text>
                    </TouchableOpacity>}
            </View>
        </View>
    )
}
export default CommunityRiskAssessment