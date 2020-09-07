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

        // HOLD FOR NOW. FETCH HTML from front end
        let html_string = "";
        html_string = ""
        let options = {
          html:
            '<h1 style="text-align: center;"><strong>Hello Guys</strong></h1><p style="text-align: center;">Here is an example of pdf Print in React Native</p><p style="text-align: center;"><strong>Team About React</strong></p>',
          fileName: 'test',
          directory: 'docs',
        };
        let file = await RNHTMLtoPDF.convert(options);
        return file.filePath;
    }

    useEffect(()=> {
        setTimeout( async ()=> {
            const isConnected = await NetworkUtils.isNetworkAvailable()
            if (isConnected != true) {
              Alert.alert(
                'CBEWS-L is not connected to the internet',
                'CBEWS-L Local data will be used.',
                [
                  { text: 'Ok', onPress: () => {
                    askPermission();
                  }, style: 'cancel' },
                ]
              )
            } else {
                fetchLatestData();
            }
          },100);
    },[]);

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
        const isConnected = await NetworkUtils.isNetworkAvailable()
        if (isConnected != true) {
          Alert.alert(
            'CBEWS-L is not connected to the internet',
            'Cannot perform download due to internet / lan connection.',
            [
              { text: 'Ok', onPress: () => {}, style: 'cancel' },
            ]
          )
        } else {
            let path = await createPDF(item);
            FileViewer.open(path)
            .then(() => {
                // success
            })
            .catch(error => {
                // error
            });
        }
    }

    const generateReport = async () => {
        if (moment(startDate) <= moment(endDate)) {
            let report_list = await UmiReports.GetReportsByRange(startDate, endDate);
            setItemList(report_list);
            setListDisplay(true);
        } else {
            Alert.alert("Invalid date range. Please select a valid date range.")
        }
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