import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Alert, PermissionsAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ContainerStyle } from '../../../styles/container_style';
import { ListItem } from 'react-native-elements'
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import { UmiReports } from '@dynaslope/commons';
import moment from 'moment';
import NetworkUtils from '../../../utils/NetworkUtils';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

function ReportSummary(props) {
    const navigator = props.navigation;
    const [isDisabled, setDisabledCommands] = useState(false);
    const [items, setItem] = useState([]);

    const [date, setDate] = useState(new Date());
    const [datePicker, setDatePicker] = useState([]);
    const [showList, setListDisplay] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
    const [isPermitted, setPermission] = useState(false);
    const [pdfPath, setPdfPath] = useState({});
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    };

    const report_keys = [
        'UmiFieldSurveyLogs',
        'UmiSituationReport'
    ];

    const list = [{
        'name': 'No available reports.',
        'report_date': 'YYYY-MM-DD'
    }];

    const askPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'CBEWS-L External Storage Write Permission',
                message:
                  'CBEWS-L needs access to Storage data in your SD Card ',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setPermission(true);
            } else {
              alert('WRITE_EXTERNAL_STORAGE permission denied');
            }
        } catch (err) {
        alert('Write permission err', err);
        }
    };

    const createPDF = async(item) => {
    }

    const showDatePicker = (entity, selectedDate) => {
        setDatePicker(
            <DateTimePicker
                value={date}
                mode={'date'}
                display="default"
                onChange={(i,v)=> {
                    if (entity == 'start') {
                        setStartDate(moment(v).format('YYYY-MM-DD'));
                    } else {
                        setEndDate(moment(v).format('YYYY-MM-DD'));
                    }
                }}
            />
        )
    }

    const download = async (item) => {
    }

    const generateReport = async () => {
    }

    return (
        <ScrollView>
            <View style={ContainerStyle.content}>
                <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Reports</Text>
                <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Consolidated Reports of CBEWS-L App</Text>
                <View style={{alignItems: 'center', marginTop: 20, marginRight: 20, marginLeft: 20}}>
                    <Input placeholder="YYYY-MM-DD"
                        label="Start date"
                        value={startDate.toString()}
                        inputStyle={{ textAlign: 'center', padding: 0 }}
                        onFocus={()=> { showDatePicker('start', startDate) }} />
                    <Input placeholder="YYYY-MM-DD"
                        label="End date"
                        value={endDate.toString()}
                        inputStyle={{ textAlign: 'center', padding: 0 }}
                        onFocus={()=> { showDatePicker('end', endDate) }} />
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity style={ButtonStyle.medium} onPress={generateReport} disabled={isDisabled}>
                            <Text style={ButtonStyle.medium_text}>Generate Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                { 
                    showList == true &&
                    <View style={{marginTop: 20}}>
                        <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Generated Report List</Text>
                        <View style={{maxHeight: '100%', padding: '5%'}}>
                            <ScrollView>
                                {
                                    itemList.length != 0 ? itemList.map((l) => (
                                        <TouchableOpacity key={`${l.type}_${l.report_date}`} onPress={()=> { download(l) }}>
                                            <ListItem
                                                key={`${l.report_date}_${l.type}`}
                                                containerStyle={{backgroundColor: 'transparent'}}
                                                contentContainerStyle={{alignItems: 'center'}}
                                                title={`${l.type}_${l.report_date}`}
                                                subtitle={l.report_date.toUpperCase()}
                                                hideChevron={true}
                                            />
                                        </TouchableOpacity>
                                    )) :
                                    <View style={{padding: '10%'}}>
                                        <Text style={[LabelStyle.large_label, LabelStyle.brand]}>No files available for download.</Text>
                                    </View>
                                }
                            </ScrollView>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click item to download</Text>
                        </View>
                    </View>
                }
            </View>

            { datePicker }

        </ScrollView>
    );
}

export default ReportSummary;