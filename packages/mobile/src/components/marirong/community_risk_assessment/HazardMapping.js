import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TouchableHighlight, Image, RefreshControl, SafeAreaView } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ContainerStyle } from '../../../styles/container_style';
import { ImageStyle } from '../../../styles/image_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarCommunityRiskAssessment, AppConfig } from '@dynaslope/commons';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

function HazardMapping() {

    const [mapView, setMapView] = useState(false);
    const [mapList, setMapList] = useState([]);
    const [mapTS, setMapTS] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            initMaps();
        }
}, [isFocused])

    const initMaps = async () => {
		const response = await MarCommunityRiskAssessment.GetHazardMaps();
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
            <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Hazard Map for Marirong, Leon, Iloilo as of {moment(mapTS).format("MMMM D, YYYY h:mm A")}</Text>
            {mapList.length == 0 ?
                <Text style={[LabelStyle.large_label, LabelStyle.brand]} > No Hazard map available.</Text>
                :
                <TouchableHighlight onPress={() => showMaps()}>
                    <Image
                        style={ImageStyle.hazard_maps}
                        source={mapList}
                        resizeMode="center" />
                </TouchableHighlight>
            }
            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click image to enlarge.</Text>
            <Modal visible={mapView}
                transparent={true}>
                <ImageViewer imageUrls={[{url:mapList.uri}]} enableSwipeDown={true} onSwipeDown={() => { hideMaps() }} />
            </Modal>
            <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
                <TouchableOpacity style={ButtonStyle.medium} onPress={() => { initMaps() }}>
                    <Text style={ButtonStyle.large_text}>Map +</Text>
                </TouchableOpacity>
            </View>
        </View>
    	</ScrollView>
	</SafeAreaView>
    )
}

export default HazardMapping;