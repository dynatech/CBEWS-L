import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TouchableHighlight, ToastAndroid, Image, RefreshControl, SafeAreaView } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ContainerStyle } from '../../../styles/container_style';
import { ImageStyle } from '../../../styles/image_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { UmiRiskManagement, AppConfig } from '@dynaslope/commons';
import { useIsFocused } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';

function Maps() {
	const [mapView, setMapView] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [mapList, setMapList] = useState([]);
	const [mapTS, setMapTS] = useState(null);
	const [singleFile, setSingleFile] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const isFocused = useIsFocused();

	useEffect(() => {
			if(isFocused){
				initMaps();
			}
	}, [isFocused])

	const initMaps = async () => {
		const response = await UmiRiskManagement.GetHazardMaps();
		if (response.status) {
			if (response.data.length > 0) {
				setMapList({uri: `${AppConfig.HOST_DIR}:5001/src/client-cbewsl/UMINGAN/MAPS/${response.data[0].filename}`});
				setMapTS(response.data[0].ts);
			}
		}
	};

	// Refresh Maps on pull down
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		initMaps().then(() => setRefreshing(false));
	}, []);

	const showMaps = () => {
		setMapView(true);
	}
	const hideMaps = () => {
		setMapView(false);
	}
	const disableUploadButton = () => {
		setIsDisabled(true);
	}
	const enableUploadButton = () => {
		setIsDisabled(false);
	}

	const handleUpload = async () => {
		disableUploadButton();
		const fileToUpload = singleFile;
		const data = new FormData();
		data.append('file', fileToUpload);
		const response = await UmiRiskManagement.UploadHazardMaps(data);
		if (response.status === true) {
			ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
		} else {
			ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
		}
		setSingleFile(null);
		initMaps();
		enableUploadButton();
	}

	const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.images],
      });
      setSingleFile(res);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        setSingleFile(null);
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

	return (
		<SafeAreaView>
			<ScrollView refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
				}
			>
				<View style={ContainerStyle.content}>
					<Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Hazard Map for Umingan, Alimodian, Iloilo as of {moment(mapTS).format("MMMM D, YYYY h:mm A")}</Text>
					{mapList.length == 0 ?
						<Text style={[LabelStyle.large_label, LabelStyle.brand]} > No Hazard map available.</Text>
						:
						<TouchableHighlight onPress={showMaps}>
							<Image
							style={ImageStyle.hazard_maps}
							source={mapList}
							resizeMode="center"
							/>
						</TouchableHighlight>
					}
					<Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click image to enlarge.</Text>
					<Modal visible={mapView}
						transparent={true}>
						<ImageViewer imageUrls={[{url:mapList.uri}]} enableSwipeDown={true} onSwipeDown={() => { hideMaps() }} />
					</Modal>
				</View>
				<View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
					{/* Show Map+ when singleFile is empty, else show Upload */}
					{singleFile == null ? (
						<TouchableOpacity style={ButtonStyle.medium} onPress={selectFile}>
							<Text style={ButtonStyle.large_text}>Map +</Text>
						</TouchableOpacity>
					):(
						<Fragment>
							<Text>
								File Name: {singleFile.name ? singleFile.name : ''}
								{'\n'}
							</Text>
							<TouchableOpacity style={ButtonStyle.medium} onPress={handleUpload} disabled={isDisabled}>
								<Text style={ButtonStyle.large_text}>Upload Map</Text>
							</TouchableOpacity>
						</Fragment>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default Maps;