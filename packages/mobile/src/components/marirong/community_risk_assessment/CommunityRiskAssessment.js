import React, { useState, useEffect } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { ContainerStyle } from '../../../styles/container_style';
import { LabelStyle } from '../../../styles/label_style';
import { ButtonStyle } from '../../../styles/button_style';
import { MarCommunityRiskAssessment } from '@dynaslope/commons';
import MobileCaching from '../../../utils/MobileCaching';
import NetworkUtils from '../../../utils/NetworkUtils';
import Uploader from '../../utils/Uploader';
import FilePickerManager from 'react-native-file-picker';
import RNFS from 'react-native-fs'

function CommunityRiskAssessment() {
    const [list, setList] = useState([])
    const [confirmUpload, setConfirmUpload] = useState(false);
    const [filename, setFilename] = useState("None");
    const [filepath, setFilepath] = useState();
    const [filetype, setFiletype] = useState();
    const [filesize, setFilesize] = useState();

    useEffect(()=> {
        init()
    },[])

    const init = async () => {
      const isConnected = await NetworkUtils.isNetworkAvailable()
      if (isConnected != true) {
        setList([{"file_path": "", "file_type": "NA", "filename": "DATA CONNECTION NOT AVAILABLE"}])
      } else {
        let response = await MarCommunityRiskAssessment.GetCommunityRiskAssessment()
        if (response.status == true) {
            setList(response.data);
        } else {
            setList([{"file_path": "", "file_type": "NA", "filename": "NO AVAILABLE DATA"}])
        }
      }
    }

    const comfirmUpload = async () => {
      const url = 'http://192.168.0.15:5000/v2/upload/community_risk_assessment/mar/community_risk_assessment'
      const file = [{
        name: 'file',
        filename: filename,
        filepath: filepath,
        filetype: filetype,
        filesize: filesize
      }];

      let upload_status = await Uploader(url, file);
      if (upload_status.status == true) {
        ToastAndroid.showWithGravity(upload_status.message, ToastAndroid.LONG, ToastAndroid.CENTER)
        init();
        resetState();
      } else {
        ToastAndroid.showWithGravity(upload_status.message, ToastAndroid.LONG, ToastAndroid.CENTER)
      }
    }

    const uploadFile = () => {
        FilePickerManager.showFilePicker(null, (response) => {
          if (response.didCancel) {
            console.log('User cancelled file picker');
          }
          else if (response.error) {
            console.log('FilePickerManager Error: ', response.error);
          }
          else {
            setFilepath(response.path);
            setFiletype(response.type);
            setFilesize(response.size);
            setFilename(response.fileName);
            setConfirmUpload(true);
          }
        });
      }
    

    const downloadFile = async (full_path, file_name) => {
      // Only available in Metro bundler
      // Disabling for now
      // const HTTP_URL = full_path.replace('/var/www/html', '');
      const isConnected = await NetworkUtils.isNetworkAvailable()
      if (isConnected != true) {
        Alert.alert(
          'CBEWS-L is not connected to the internet',
          'Cannot download file from server.',
          [
            { text: 'Ok', onPress: () => { }, style: 'cancel' },
          ]
        )
      } else {
        RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: RNFetchBlob.fs.dirs.DownloadDir + "/" + file_name,
            description: 'File downloaded by download manager.'
            ,
          }
        })
          .fetch('GET', `${AppConfig.HOST_DIR}${HTTP_URL}`)
          .then((res) => {
            ToastAndroid.show(`The file saved to ${res.path()}`, ToastAndroid.LONG);
          })
      }
    }

    const resetState = () => {
      setConfirmUpload(false)
      setFilename("None")
      setFilepath('')
      setFiletype('')
      setFilesize('')
    }

    return (
      <View style={ContainerStyle.content}>
          <Text style={[LabelStyle.large_label, LabelStyle.brand]}>Community Risk Assessment</Text>
          <Text style={[LabelStyle.small_label, LabelStyle.brand]}>Reports and Documents</Text>
          <View style={{maxHeight: '68%', padding: '5%'}}>
              <ScrollView>
                  {
                      list.length != 0 ? list.map((l) => (
                          <TouchableOpacity key={l.file_path+l.filename} onPress={()=> { downloadFile(l.file_path + l.filename, l.filename); }}>
                              <ListItem
                                  key={l.file_path + l.filename}
                                  containerStyle={{backgroundColor: 'transparent'}}
                                  contentContainerStyle={{alignItems: 'center'}}
                                  key={l.filename}
                                  title={l.filename}
                                  subtitle={l.file_type.toUpperCase()+ " FILE"}
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
          <View style={{ paddingTop: '10%', alignItems: 'center' }}>
              <Text style={[LabelStyle.medium_label, LabelStyle.brand]}>Selected file: {filename}</Text>
              {confirmUpload ?
                  <TouchableOpacity style={ButtonStyle.medium} onPress={comfirmUpload}>
                      <Text style={ButtonStyle.large_text}>Confirm Upload</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity style={ButtonStyle.medium} onPress={uploadFile}>
                      <Text style={ButtonStyle.large_text}>Upload file</Text>
                  </TouchableOpacity>}
          </View>
      </View>
    )
}
export default CommunityRiskAssessment