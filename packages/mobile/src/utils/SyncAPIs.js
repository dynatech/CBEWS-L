import { MarCommunityRiskAssessment,
         UmiRiskManagement } from '@dynaslope/commons';

const MARIRONG_API_LIST = (data) => {
    return {
        'MarCapacityAndVulnerability': {
            'add': (async (cav)=> {
                alert(JSON.stringify(cav));
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

            }),
            'update': (async (data)=> {

            }),
            'delete': ((data)=> {

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
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(data));
            })
        }
        ,'UmiFamilyRiskProfile': {
            'add': (async (data)=> {

            }),
            'update': (async (data)=> {

            }),
            'delete': ((data)=> {

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