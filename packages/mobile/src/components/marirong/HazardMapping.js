import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableHighlight, Image } from 'react-native';
import { ContainerStyle } from '../../styles/container_style';
import { ImageStyle } from '../../styles/image_style';
import { LabelStyle } from '../../styles/label_style';
import ImageViewer from 'react-native-image-zoom-viewer';

function HazardMapping() {
    const [mapView, setMapView] = useState(false);
    const [mapList, setMapList] = useState([])

    useEffect(() => {
        // Set fetching of maps
    }, [])

    const showMaps = () => {

    }

    const hideMaps = () => {

    }

    return (
        <View style={ContainerStyle.content}>
            <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Latest Hazard Map for Marirong, Leon, Iloilo as of (last uploaded ts)</Text>
            {mapList.length == 0 ?
                <Text style={[LabelStyle.large_label, LabelStyle.brand]} > No Hazzard map available.</Text>
                :
                <TouchableHighlight onPress={() => this.showMapFunction()}>
                    <Image
                        style={ImageStyle.hazard_maps}
                        source={mapList[0]}
                        resizeMode="center" />
                </TouchableHighlight>
            }
            <Text style={[LabelStyle.small_label, LabelStyle.brand]}>* Click image to enlarge.</Text>
            <Modal visible={mapView}
                transparent={true}>
                <ImageViewer imageUrls={mapList} enableSwipeDown={true} onSwipeDown={() => { hideMaps() }} />
            </Modal>
            <View style={{ paddingTop: '10%', alignItems: 'center' }}>
            </View>
        </View>
    )
}

export default HazardMapping