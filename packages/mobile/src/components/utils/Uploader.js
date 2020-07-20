import React from 'react';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

const Uploader = async (url, file) => {
  return await RNFS.uploadFiles({
      toUrl: url,
      files: file,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      fields: {
        'hello': 'world',
      }
    }).promise.then((response) => {
      let data = JSON.parse(response.body);
      return {
        'status': true,
        'message': 'Upload success!',
        'file_path': data.file_path
      };
    }).catch((err) => {
       return {
        'status': false,
        'message': `Upload failed! Err: ${err}`
      }
    });
}

export default Uploader