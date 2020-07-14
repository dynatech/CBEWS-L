import AppConfig from '../../utils/AppConfig';

const GetSituationReport = () => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/situation_report/umi/situation_report_logs`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const InsertSituationReport = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/add/situation_report/umi/situation_report_logs`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const UpdateSituationReport = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/update/field_survey/umi/field_survey_logs`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const DeleteSituationReport = (data) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/delete/field_survey/umi/field_survey_logs`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            console.log(error)
        }
    );
}

const UploadSituationReport = (data) => {
    const file = [{
      name: 'file',
      filename: data['filename'],
      filepath: data['filepath'],
      filetype: data['filetype'],
      filesize: data['filesize']
    }];
    return Uploader(`${AppConfig.HOSTNAME}/v2/upload/situation_report/umi/situation_report_logs`, file);
}

export { GetSituationReport, InsertSituationReport, UpdateSituationReport, DeleteSituationReport, UploadSituationReport }