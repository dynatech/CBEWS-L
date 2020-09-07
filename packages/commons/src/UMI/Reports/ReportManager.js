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

export { GetReportsByRange }