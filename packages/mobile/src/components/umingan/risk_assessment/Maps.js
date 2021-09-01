import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TouchableHighlight, Image, RefreshControl, SafeAreaView } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ContainerStyle } from '../../../styles/container_style';
import { ImageStyle } from '../../../styles/image_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { InputStyle } from '../../../styles/input_style';
import { UmiRiskManagement, AppConfig } from '@dynaslope/commons';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

function Maps() {
	const [mapView, setMapView] = useState(false);
	const [mapList, setMapList] = useState([]);
	const [mapTS, setMapTS] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const isFocused = useIsFocused();

	
	const initMaps = async () => {
	};

	// Refresh Maps on pull down
	const onRefresh = React.useCallback(() => {
	}, []);

	const showMaps = () => {
		setMapView(true);
	}

	const hideMaps = () => {
		setMapView(false);
	}
    
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
								<TouchableHighlight onPress={() => showMaps()}>
										<Image
												style={ImageStyle.hazard_maps}
												source={mapList}
												// source={{uri:'http://192.168.0.150:5001/src/client-cbewsl/UMINGAN/MAPS/hazard_map_01.jpg'}}
												resizeMode="center" />
								</TouchableHighlight>
						}
						<Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click image to enlarge.</Text>
						<Modal visible={mapView}
							transparent={true}>
							<ImageViewer imageUrls={[{url:mapList.uri}]} enableSwipeDown={true} onSwipeDown={() => { hideMaps() }} />
						</Modal>
						<View style={{ paddingTop: '10%', alignItems: 'center' }}>
						</View>
				</View>
				<View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
					<TouchableOpacity style={ButtonStyle.medium} onPress={() => { initMaps() }}>
						<Text style={ButtonStyle.large_text}>Map +</Text>
					</TouchableOpacity>
			</View>

			</ScrollView>
		</SafeAreaView>
	)
}

export default Maps;