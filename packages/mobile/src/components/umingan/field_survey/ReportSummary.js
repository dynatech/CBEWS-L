import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, ToastAndroid, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { InputStyle } from '../../../styles/input_style';
import { UmiFieldSurvey } from '@dynaslope/commons';
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
import { Chip } from 'react-native-paper';
import MaterialChip from "react-native-material-chip"


function ReportSummary() {
	const [openModal, setOpenModal] = useState(false);
	const [fieldSurveyReport, setFieldSurveyReport] = useState([]);
	const [fieldSurvey, setFieldSurvey] = useState([]);
	const [fieldSurveyReportDate, setFieldSurveyReportDate] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));
	const [isDisabled, setDisabled] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const isFocused = useIsFocused();
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [selectedPrinter, setSelectedPrinter] = useState(null);
	const [subject, setSubject] = useState(null);

	const initFieldSurveySummary = async () => {
		const isConnected = await NetworkUtils.isNetworkAvailable()
		if (isConnected != true) {
			if(isInitialLoad){
				Alert.alert(
					'CBEWS-L is not connected to the internet',
					'CBEWS-L Local data will be used.',
					[
						{ text: 'Ok', onPress: () => {
							MobileCaching.getItem('UmiFieldSurveySummary').then(response => {
									init(response);
									setFieldSurvey(response);
									setIsInitialLoad(false);
							});
						}, style: 'cancel' },
					]
				)
			} else {
				MobileCaching.getItem('UmiFieldSurveySummary').then(response => {
					init(response);
					setFieldSurvey(response);
				});
			}
		} else {
				fetchLatestData();
		}
	}

	// Refresh Risk Assessment Summary on pull down
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		initFieldSurveySummary().then(() => setRefreshing(false));
	}, []);

	useEffect(()=> {
		if(isFocused){
			initFieldSurveySummary();
		}
	}, [isFocused]);

	const fetchLatestData = async () => {
		let response = await UmiFieldSurvey.GetLatestReportSummary();
		if (response.status == true) {
			init(response.data);
			setFieldSurvey(response.data);
			MobileCaching.setItem('UmiFieldSurveySummary', response.data);
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
			html: HTMLtoString('umi_field_survey', fieldSurvey),
			fileName: 'Umingan Field Survey',
			base64: true,
		});
		await RNPrint.print({filePath: results.filePath});
	};

	const init = async (data) => {
			let temp = [];
			if (data.length != 0) {
					temp.push(
							<View key={'container'}>
									<View key={'report_date_container'}>
											<Text key={'report_date'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
													Date:
											</Text>
											<Text key={'report_date_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
													{ moment(data[0].report_date).format("MMMM D, YYYY h:mm A") }
											</Text>
									</View>
									<View key={'feature_container'}>
											<Text key={'feature'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
													Feature:
											</Text>
											<Text key={'feature_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
													{ data[0].feature }
											</Text>
									</View>
									<View key={'materials_characterization_container'}>
											<Text key={'materials_characterization'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
													Materials Characterization:
											</Text>
											<Text key={'materials_characterization_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
													{ data[0].materials_characterization }
											</Text>
									</View>
									<View key={'mechanism_container'}>
											<Text key={'mechanism'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
													Mechanism:
											</Text>
											<Text key={'mechanism_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
													{ data[0].mechanism }
											</Text>
									</View>
									<View key={'exposure_container'}>
											<Text key={'exposure'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold'}]}>
													Exposure:
											</Text>
											<Text key={'exposure_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left'}]}>
													{ data[0].exposure }
											</Text>
									</View>
									<View key={'note_container'}>
											<Text key={'note'} style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', fontWeight: 'bold', color: 'red'}]}>
													Report Narrative:
											</Text>
											<Text key={'note_value'}style={[LabelStyle.medium_label, LabelStyle.brand, {textAlign: 'left', color: 'red'}]}>
													{ data[0].report_narrative }
											</Text>
									</View>
							</View>
					)
					setFieldSurveyReportDate(moment(data[0].report_date).format('MMMM Do YYYY, h:mm:ss a'));
			} else {
					temp.push(
							<Text key={0} style={[LabelStyle.medium_label, LabelStyle.brand, {fontWeight: 'bold'}]}>
									No field survey report available.
							</Text>
					)
					setDisabled(true);
			}
			setFieldSurveyReport(temp)
	}

	const download = async () => {
			let download_response = UmiFieldSurvey.DownloadLatestReportSummary(fieldSurvey);
			// TODO: Use react-native library to render PDF.
			printPDF();
	}

	const email = async () => {
			let email_response = UmiFieldSurvey.EmailLatestReportSummary(fieldSurvey);
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
				<Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Field Survey Report as of { fieldSurveyReportDate } </Text>
				<View style={{ padding: 20}}>
						{ fieldSurveyReport }
				</View>
				<View style={{alignItems: 'center'}}>
					<View style={{ alignItems: 'center', flexDirection: 'row' }}>
						<TouchableOpacity style={ButtonStyle.small} onPress={() => { download() }} disabled={isDisabled}>
								<Text style={ButtonStyle.medium_text}>Download</Text>
						</TouchableOpacity>
						<TouchableOpacity style={ButtonStyle.small} onPress={() => { email(); showModal(); }} disabled={isDisabled}>
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

export default ReportSummary