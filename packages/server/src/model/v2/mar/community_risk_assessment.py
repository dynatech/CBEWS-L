from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class CommunityRiskAssessment():

    def create_cav(data):
        h.var_checker("data", data)
        h.var_checker("data.values()", data.values())
        (datetime, resource, quantity, status, owner, incharge, last_ts, updater, user_id) = data.values()
        schema = "cbewsl_mar_collections"
        query = f'INSERT INTO capacity_and_vulnerability VALUES (0, "{resource}", {quantity}, "{status}", ' \
                f'"{owner}", "{incharge}", "{updater}", "{datetime}", {user_id}, "{last_ts}")'
        h.var_checker("query", query)
        try:
            cav_id = DB.db_modify(query, schema, True)
        except Exception as err:
            raise(err)
        h.var_checker("cav_id", cav_id)
        return cav_id

    def fetch_cav(cav_id):
        if cav_id == "all":
            query = 'SELECT * FROM capacity_and_vulnerability'
        else:
            query = f'SELECT * FROM capacity_and_vulnerability WHERE cav_id = "{cav_id}"'
        schema = "cbewsl_mar_collections"
        result = DB.db_read(query, schema)
        return result
    
    def update_cav(data):
        (cav_id, datetime, resource, quantity, status, owner, incharge, updater, user_id) = data.values()
        query = f'UPDATE capacity_and_vulnerability SET ' \
            f'resource="{ resource }", quantity="{ quantity }", stat_desc="{ status }", ' \
            f'owner="{ owner }", in_charge="{ incharge }", updater="{ updater }", ' \
            f'date="{ datetime }" WHERE cav_id="{ cav_id }"'
        schema = "cbewsl_mar_collections"
        result = DB.db_modify(query, schema, True)
        return result

    def delete_cav(cav_id):
        query = f'DELETE FROM capacity_and_vulnerability WHERE cav_id = { cav_id }'
        schema = "cbewsl_mar_collections"
        result = DB.db_modify(query, schema, True)
        return result