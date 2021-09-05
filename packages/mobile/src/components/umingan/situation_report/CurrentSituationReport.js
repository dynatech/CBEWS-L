import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { InputStyle } from '../../../styles/input_style';
import { UmiSituationReport } from '@dynaslope/commons';
import moment from 'moment';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';
// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Import RNPrint
import RNPrint from 'react-native-print';
import HTMLtoString from '../../utils/HTMLtoString';
import ReactNativeChipInput from 'react-native-chip-input';


function CurrentSituationReport() {
		const [openModal, setOpenModal] = useState(false);
    const [situationReport, setSituationReport] = useState([]);
    const [situationReportContainer, setSituationReportContainer] = useState([]);
    const [situationReportDate, setSituationReportDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
    const [isDisabled, setDisabled] = useState(false);
		const [refreshing, setRefreshing] = useState(false);
		const isFocused = useIsFocused();
		const [isInitialLoad, setIsInitialLoad] = useState(true);
		const [selectedPrinter, setSelectedPrinter] = useState(null);
		const [subject, setSubject] = useState(null);

	 const initCurrentSituationReport = async() => {
		const isConnected = await NetworkUtils.isNetworkAvailable()
		if (isConnected != true) {
			if(isInitialLoad){
				Alert.alert(
					'CBEWS-L is not connected to the internet',
					'CBEWS-L Local data will be used.',
					[
						{ text: 'Ok', onPress: () => {
							MobileCaching.getItem('UmiSituationReport').then(response => {
									init(response);
									setSituationReport(response);
									setIsInitialLoad(false);
							});
						}, style: 'cancel' },
					]
				)
			} else {
				MobileCaching.getItem('UmiSituationReport').then(response => {
					init(response);
					setSituationReport(response);
				});
			}
		} else {
				fetchLatestData();
		}
	}

	// Refresh Risk Assessment Summary on pull down
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		initCurrentSituationReport().then(() => setRefreshing(false));
	}, []);

  useEffect(()=> {
		if(isFocused){
			initCurrentSituationReport();
		}
	}, [isFocused]);

	const fetchLatestData = async () => {
		let response = await UmiSituationReport.GetCurrentSituationReport();
		if (response.status == true) {
			init(response.data);
			setSituationReport(response.data);
			MobileCaching.setItem('UmiSituationReport', response.data);
		} else {
			ToastAndroid.showWithGravity(response.message, ToastAndroid.LONG, ToastAndroid.CENTER)
		}
	}

	// Only for iOS
	const selectPrinter = async () => {
		const selectedPrinter = 
		  await RNPrint.selectPrinter({x: 100, y: 100});
		setSelectedPrinter(selectedPrinter);
	};
	  // Only for iOS
	const silentPrint = async () => {
		if (!selectedPrinter) {
		  alert('Must Select Printer First');
		}
		const jobName = await RNPrint.print({
		  printerURL: selectedPrinter.url,
		  html: '<h1>Silent Print clicked</h1>',
		});
	};

	const printPDF = async () => {
		const results = await RNHTMLtoPDF.convert({
			html: HTMLtoString('umi_situation_report', situationReport),
			fileName: 'Umingan Situtation Report',
			base64: true,
		});
		await RNPrint.print({filePath: results.filePath});
	};

	const init = (data) => {
		let temp = [];
		if (data.length != 0) {
				temp.push(
						<View key={'container'}>
								<View key={'report_date_container'}>
										<Text key={'report_date'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
												Date:
										</Text>
										<Text key={'report_date_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
												{ data[0].last_ts }
										</Text>
								</View>
								<View key={'report_summary_container'}>
										<Text key={'report_summary'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
												Summary:
										</Text>
										<Text key={'report_summary_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
												{ data[0].report_summary }
										</Text>
								</View>
						</View>
				)
				setSituationReportDate(moment(data[0].report_ts).format('MMMM Do YYYY, h:mm:ss a'));
		} else {
				temp.push(
						<Text key={0} style={[LabelStyle.medium_label, LabelStyle.brand, {fontWeight: 'bold'}]}>
								No field situation report available.
						</Text>
				)
				setDisabled(true);
		}
		
		setSituationReportContainer(temp)
	}

    const download = async () => {
        let download_response = UmiSituationReport.DownloadSituationReport(situationReport);
        // TODO: Dev this function when the Web functionality is available
				printPDF();
    }

    const email = async () => {
        let email_response = UmiSituationReport.EmailSituationReport(situationReport);
        // TODO: Dev this function when the Web functionality is available
    }

    const showModal = () => {
			setOpenModal(true);
		}
	
		const closeModal = () => {
			setOpenModal(false);
		}
    return(
			<SafeAreaView>
				<ScrollView refreshControl={
					<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
					/>
					}
				>
				<View style={ContainerStyle.content}>
						<Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Situation Report as of { situationReportDate } </Text>
						<View style={{ padding: 20}}>
								{ situationReportContainer }
						</View>
						<View style={{alignItems: 'center'}}>
								<View style={{ alignItems: 'center', flexDirection: 'row' }}>
										<TouchableOpacity style={ButtonStyle.small} onPress={download} disabled={isDisabled}>
												<Text style={ButtonStyle.medium_text}>Download</Text>
										</TouchableOpacity>
										<TouchableOpacity style={ButtonStyle.small} onPress={() =>{email(); showModal();}} disabled={isDisabled}>
												<Text style={ButtonStyle.medium_text}>Send</Text>
										</TouchableOpacity>
								</View>
						</View>
				</View>

				<Modal animationType="slide"
					visible={openModal}
					onRequestClose={() => { 
						closeModal();
					}}>
					<View style={ContainerStyle.content}>
						<Text style={[LabelStyle.large_label, LabelStyle.brand]}>Send Report via Email</Text>
						{/* Chip input */}
						<ReactNativeChipInput
							variant="contained"
							inputVarint="outlined"
							showChipIcon={true}
							chipIconAction={e => console.log(e)}
							placeholder="To"
							primaryColor="#1976d2"
							secondaryColor="#ffffff"
							autoCapitalize="none"
							autoCorrect={false}
							autoFocus={true}
							size='small'
							style={InputStyle.small}
						/>
						{/* Text input */}
						<TextInput
							style={InputStyle.small}
							onChangeText={setSubject}
							value={subject}
							placeholder="Subject"
							keyboardType="default"
						/>
						{/* Richtext editor */}
						<TextInput
							style={InputStyle.large}
							onChangeText={setSubject}
							value={subject}
							placeholder="Compose email"
							keyboardType="default"
							multiline={true}
						/>
					</View>
					<View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
						<TouchableOpacity style={ButtonStyle.medium} onPress={() => { download() }} disabled={isDisabled}>
							<Text style={ButtonStyle.large_text}>Send</Text>
						</TouchableOpacity>
					</View>
				</Modal>
				</ScrollView>
			</SafeAreaView>
    )
}

export default CurrentSituationReport;