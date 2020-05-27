import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { InputStyle } from '../../../styles/input_style';

function RiskAssessmentSummary() {
    return (
        <ScrollView>
        <View style={ContainerStyle.content}>
            <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Risk Assessment Summary</Text>
            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Summary of Reports / Logs</Text>
            <View style={ContainerStyle.datatable_content}>
                <DataTable style={{ flex: 1, padding: 10, textAlign: 'center'}}>
                    <DataTable.Header>
                        <DataTable.Title>Location</DataTable.Title>
                        <DataTable.Title>Impact</DataTable.Title>
                        <DataTable.Title>Adaptive Capacity</DataTable.Title>
                        <DataTable.Title>Vulnerability</DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row onPress={() => { }}>
                        <DataTable.Cell>test</DataTable.Cell>
                        <DataTable.Cell>test</DataTable.Cell>
                        <DataTable.Cell>test</DataTable.Cell>
                        <DataTable.Cell>test</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
                <DataTable.Pagination
                    page={1}
                    numberOfPages={3}
                    onPageChange={(page) => { console.log(page); }}
                    label="1-2 of 6"
                />
            </View>
            <View>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click row to modify.</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                <TouchableOpacity style={ButtonStyle.medium} onPress={() => {}}>
                    <Text style={ButtonStyle.large_text}>Add +</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
    )
}

export default RiskAssessmentSummary;