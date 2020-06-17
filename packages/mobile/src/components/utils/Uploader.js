import React from 'react';
// import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

const Uploader = (url, file) => {
    return RNFS.uploadFiles({
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
        if (response.statusCode == 200) {
            return {
                'status': true,
                'message': 'Upload success!'
            }
        } else {
            return {
                'status': false,
                'message': 'Upload failed!'
            }
        }
      }).catch((err) => {
            if (err.description === "cancelled") {
            // cancelled by user
            }
            console.log(err);
        });
}

export default Uploader