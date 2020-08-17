import { MarCommunityRiskAssessment,
         UmiRiskManagement,
         UmiFieldSurvey } from '@dynaslope/commons';

const MARIRONG_API_LIST = (data) => {
    return {
        'MarCapacityAndVulnerability': {
            'add': (async (cav)=> {
                let result = await MarCommunityRiskAssessment.InsertCapacityAndVulnerability({
                    'resource': cav.resource,
                    'quantity': cav.quantity,
                    'status': cav.stat_desc,
                    'owner': cav.owner,
                    'in_charge': cav.incharge,
                    'date': cav.date,
                    'updater': cav.updater,
                    'attachment': {},
                    'user_id': cav.user_id
                })
                // Loading counter
            }),
            'update': (async (cav)=> {
                let temp = [];
                for (var key in cav) {
                    let obj = {};
                    if (key != 'alterations') {
                        obj[key] = cav[key];
                        temp.push(obj);
                    }   
                }
                let response = await MarCommunityRiskAssessment.UpdateCapacityAndVulnerability(temp)
                // Loading counter
            }),
            'delete': ((cav)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(cav));
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