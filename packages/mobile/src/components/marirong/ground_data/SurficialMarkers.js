import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { MarGroundData } from '@dynaslope/commons';
import { DataTable } from 'react-native-paper';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import Forms from '../../utils/Forms';
import NetworkUtils from '../../../utils/NetworkUtils';
import MobileCaching from '../../../utils/MobileCaching';

function SurficialMarkers() {

    let formData = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [surficialData, setSurficialData] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [dataTableHeaders, setDataTableHeaders] = useState([]);
    const [dataTableContent, setDataTableContent] = useState([]);
    const [selectedData, setSelectedData] = useState({});
    const [cmd, setCmd] = useState('add');
    const [defaultStrValues, setDefaultStrValues] = useState({});

    useEffect(() => {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    MobileCaching.getItem('MarSurficialData').then(response => {
                        init(response);
                    });
                  }, style: 'cancel' },
                ]
              )
            } else {
                fetchLatestData();
            }
          },100);
    }, [])

    const init = async (response) => {
            let temp = [];
            let temp_headers = [];
            if (response.markers.length != 0) {
                response.markers.forEach(element => {
                    temp_headers.push(<DataTable.Title style={{width: 50}}>{element.marker_name}</DataTable.Title>)
                });

                if (response.data.length != 0) {
                    response.data.forEach(element => {
                        temp.push(
                            <DataTable.Row key={element.id} onPress={() => {  }}>
                                {/* <DataTable.Cell>{element.observance_ts}</DataTable.Cell>
                                <DataTable.Cell>{element.feature_type}</DataTable.Cell>
                                <DataTable.Cell>{element.reporter}</DataTable.Cell>
                                <DataTable.Cell>{element.description}</DataTable.Cell> */}
                            </DataTable.Row>
                        )
                    });
                } else {
                    temp.push(
                        <View key={0} style={{padding: 10}}>
                            <Text>No available data.</Text>
                        </View>
                    )
                }
                setDataTableHeaders(temp_headers)
                setDataTableContent(temp)
                setSurficialData(response.data);
                setMarkers(response.markers)
            } else {
                // Display error
            }

    }

    const showForm = () => {
        setOpenModal(true);
    }

    const closeForm = () => {
        setOpenModal(false);
    }

    const fetchLatestData = async () => {
        let response = await MarGroundData.GetSurficialMarkersData();
        if (response.status == true) {
            init(response);
            MobileCaching.setItem('MarSurficialData', response.data);
        } else {
            ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        }
    }

    return(
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Surficial Data</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Add / Modify / Surficial data</Text>
                <View style={ContainerStyle.datatable_content}>
                    <ScrollView horizontal={true}>
                        <DataTable style={{ flex: 1, padding: 10}}>
                            <DataTable.Header>
                                <DataTable.Title style={{width: 150}}>Observance timestamp</DataTable.Title>
                                { dataTableHeaders }
                                <DataTable.Title style={{width: 150}}>Weather Condition</DataTable.Title>
                                <DataTable.Title style={{width: 150}}>Nagsukat / Reporter</DataTable.Title>
                            </DataTable.Header>
                            { dataTableContent }
                        </DataTable>
                    </ScrollView>
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
                    <TouchableOpacity style={ButtonStyle.medium} onPress={() => { showForm() }}>
                        <Text style={ButtonStyle.large_text}>Add +</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal animationType="slide"
                visible={openModal}
                onRequestClose={() => { 
                    setDefaultStrValues({})
                    setCmd('add');
                    setOpenModal(false);
                }}>
                <Forms data={{
                    string: defaultStrValues,
                    int: {}
                }}
                    formData={formData}
                    command={cmd}
                    closeForm={() => { closeForm() }}
                    submitForm={() => { submitForm() }}
                    deleteForm={() => { deleteForm() }} />
            </Modal>
        </ScrollView>
    )
}

export default SurficialMarkers