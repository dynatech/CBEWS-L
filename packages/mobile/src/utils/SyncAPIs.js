import { MarCommunityRiskAssessment } from '@dynaslope/commons';

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
                alert(JSON.stringify(result));
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
            }),
            'delete': ((cav)=> {
                alert(JSON.stringify("DELETE"))
                alert(JSON.stringify(cav));
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

}

export { MarirongSync, UminganSync }