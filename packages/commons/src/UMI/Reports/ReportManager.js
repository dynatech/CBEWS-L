import AppConfig from '../../utils/AppConfig';
import MobileCaching from '../../../../mobile/src/utils/MobileCaching';
import moment from 'moment';

const GetReportsByRange = async (start, end) => {
    let temp_field_survey = [];
    let temp_situation_report = [];
    temp_field_survey = await MobileCaching.getItem('UmiFieldSurveyLogs').then(response => {
        let temp = [];
        response.forEach(element => {
            if (moment(element.report_date) >= moment(start) && moment(element.report_date) >= moment(start)) {
                temp.push({
                    type: "Field Survey",
                    id: element.id,
                    report_date: element.report_date,
                });
            }
        });
        return temp;
    });

    temp_situation_report = await MobileCaching.getItem('UmiSituationReport').then(response => {
        let temp = [];
        response.forEach(element => {
            if (moment(element.report_ts) >= moment(start) && moment(element.report_ts) >= moment(start)) {
                temp.push({
                    type: "Situation Report",
                    id: element.id,
                    report_date: element.report_ts,
                });
            }
        });
        return temp;
    });

    return temp_field_survey.concat(temp_situation_report)
}

const GetAllFieldSurveyLogsByDate = (start, end) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/field_survey/umi/field_survey_logs/${start}/${end}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Error on fetching field survey. Err: ", error);
    }); 
}

const GetAllSituationReportsByDate = (start, end) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/get/situation_report/umi/situation_report_logs/${start}/${end}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.error("Error on fetching field survey. Err: ", error);
    }); 
}

export { GetReportsByRange, GetAllFieldSurveyLogsByDate, GetAllSituationReportsByDate }