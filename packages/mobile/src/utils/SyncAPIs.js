import { MarCommunityRiskAssessment,
         MarEventsTemplate,
         UmiRiskManagement,
         UmiFieldSurvey,
         MarMaintenanceLogs as MarirongMaintenanceLogs,
         UmiSituationReport } from '@dynaslope/commons';

const MARIRONG_API_LIST = (data) => {
    return {
        'MarCapacityAndVulnerability': {
            'add': (async (data)=> {
                let result = await MarCommunityRiskAssessment.InsertCapacityAndVulnerability({
                    'resource': data.resource,
                    'quantity': data.quantity,
                    'status': data.stat_desc,
                    'owner': data.owner,
                    'in_charge': data.incharge,
                    'date': data.date,
                    'updater': data.updater,
                    'attachment': {},
                    'user_id': data.user_id
                })
                // Loading counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await MarCommunityRiskAssessment.UpdateCapacityAndVulnerability(temp)
                // Loading counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'MarEventsTemplate': {
            'add': (async (data)=> {
                let response = await MarEventsTemplate.InsertEventsTemplate({
                    'template_name': data.template_name,
                    'message_template': data.message_template,
                    'user_id': data.user_id
                });
                // Load counter
            }),
            'update': (async (data)=> {
                let response = await MarEventsTemplate.UpdateEventsTemplate({
                    'id': data['id'],
                    'message_template': data['message_template'],
                    'template_name': data['template_name'],
                    'user_id': data['user_id']
                });
                // Load counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'MarMaintenanceLogs': {
            'add': (async (data)=> {
                let response = await MarirongMaintenanceLogs.InsertMaintenanceLogs({
                    'user_id': data['user_id'],
                    'maintenance_date': data['maintenance_date'],
                    'type': data['type'],
                    'remarks': data['remarks'],
                    'in_charge': data['in_charge'],
                    'updater': data['updater']
                });
                // Load counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await MarirongMaintenanceLogs.UpdateMaintenanceLogs(temp)
                // Load counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'MarIncidentLogs': {
            'add': (async(data)=> {
                let response = await MarirongMaintenanceLogs.InsertIncidentLogs({
                    'user_id': data['user_id'],
                    'incident_date': data['incident_date'],
                    'incident_report_narrative': data['incident_report_narrative'],
                    'reporter': data['reporter']
                });
                // Load counter
            }),
            'update': (async(data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await MarirongMaintenanceLogs.UpdateIncidentLogs(temp)
                // Load counter
            }),
            'delete': (async(data)=> {
                alert(JSON.stringify(data));
            })
        },
        'MarSurficialData': {
            'add': (async(data)=> {
                // alert(JSON.stringify(data));
            }),
            'update': (async(data)=> {

            }),
            'delete': (async(data)=> {
                alert(JSON.stringify(data));
            })
        }
    }
};

const UMINGAN_API_LIST = (data) => {
    return {
        'UmiRiskAssessmentSummary': {
            'add': (async (data)=> {
                let response = await UmiRiskManagement.InsertSummary({
                    'Location': data['location'],
                    'Impact': data['impact'],
                    'AdaptiveCapacity': data['adaptive_capacity'],
                    'Vulnerability': data['vulnerability'],
                    'attachment': data['attachment'],
                    'user_id': data['user_id']
                    
                })
                // Loading counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiRiskManagement.UpdateSummary(temp)
                // Loading counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'UmiResourceAndCapacities': {
            'add': (async (data)=> {
                let response = await UmiRiskManagement.InsertResourceAndCapacities({
                    ResourceandCapacities: data['resource_and_capacities'],
                    Status: data['status'],
                    Owner: data['owner'],
                    user_id: data['user_id']
                })
                // Loading counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiRiskManagement.UpdateResourceAndCapacities(temp)
                alert(JSON.stringify(response));
                // Loading counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'UmiHazardData': {
            'add': (async (data)=> {
                let response = await UmiRiskManagement.InsertHazardData({
                    'Hazard': data['hazard'],
                    'SpeedofOnset':data['speed_of_onset'],
                    'EarlyWarning':data['early_warning'],
                    'Impact': data['impact'],
                    'user_id': data['user_id']
                })
                // Loading counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiRiskManagement.UpdateHazardData(temp)
                // Loading Counter
            }),
            'delete': ((data)=> {

            })
        }
        ,'UmiFamilyRiskProfile': {
            'add': (async (data)=> {
                let response = await UmiRiskManagement.InsertFamilyRiskProfile({
                    'NumberofMembers': data['number_of_members'],
                    'VulnerableGroups': data['vulnerable_groups'],
                    'NatureofVulnerability': data['nature_of_vulnerability'],
                    'user_id': data['user_id']
                })
                // Loading counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiRiskManagement.UpdateFamilyRiskProfile(temp)
                // Loading Counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'UmiFieldSurveyLogs': {
            'add': (async (data)=> {
                let response = await UmiFieldSurvey.InsertFieldSurveyLogs({
                    'user_id': data['user_id'],
                    'feature': data['feature'],
                    'exposure': data['exposure'],
                    'mechanism': data['mechanism'],
                    'materials_characterization': data['materials_characterization'],
                    'report_date': data['report_date'],
                    'report_narrative': data['report_narrative'],
                    'reporter': data['reporter'],
                    'attachment_path': data['attachment_path']
                });
                // Loading Counter
            }),
            'update': (async (data)=> {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiFieldSurvey.UpdateFieldSurveyLogs(temp);
                // Loading Counter
            }),
            'delete': ((data)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        },
        'UmiSituationReport': {
            'add': (async (data) => {
                let response = await UmiSituationReport.InsertSituationReport({
                    'user_id': data['user_id'],
                    'report_summary': data['report_summary'],
                    'attachment_path': data['attachment_path'],
                    'report_ts': data['report_ts']
                });
                // Loading Counter
            }),
            'update': (async (data) => {
                let temp = [];
                for (var key in data) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = data[key];
                        temp.push(obj);
                    }   
                }
                let response = await UmiSituationReport.UpdateSituationReport(temp);
                // Loading Counter
            }),
            'delete': (async (data) => {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        }
    }
};


const MarirongSync = (data) => {
    data.forEach(element => {
        let apis = null;
        element.data.add.forEach(x => {
            apis = MARIRONG_API_LIST()[element.key][x.alterations](x);
        });

        element.data.modify.forEach(y => {
            apis = MARIRONG_API_LIST()[element.key][y.alterations](y);
        });

        element.data.delete.forEach(z => {
            apis = MARIRONG_API_LIST()[element.key][z.alterations](z);
        });
    });
}

const UminganSync = (data) => {
    data.forEach(element => {
        let apis = null;
        element.data.add.forEach(x => {
            apis = UMINGAN_API_LIST()[element.key][x.alterations](x);
        });

        element.data.modify.forEach(y => {
            apis = UMINGAN_API_LIST()[element.key][y.alterations](y);
        });

        element.data.delete.forEach(z => {
            apis = UMINGAN_API_LIST()[element.key][z.alterations](z);
        });
    });
}

export { MarirongSync, UminganSync }