import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { InputStyle } from '../../../styles/input_style';
import Forms from '../../utils/Forms';

function RiskAssessmentSummary() {

    const [openModal, setOpenModal] = useState(false);

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

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
                <TouchableOpacity style={ButtonStyle.medium} onPress={() => {showForm()}}>
                    <Text style={ButtonStyle.large_text}>Add +</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Modal animationType="slide"
            visible={openModal}
            onRequestClose={() => { setOpenModal(false) }}>
            <Forms data={{
                string: { 
                    'Location': '',
                    'Impact': '',
                    'Adaptive Capacity': '',
                    'Vulnerability': ''
                },
                int: {},
                api: ''
            }} closeForm={()=> {closeForm()}}/>
        </Modal>
    </ScrollView>
    )
}

export default RiskAssessmentSummary;