from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class CommunityRiskAssessment():

    def create_cav(data):
        schema = "cbewsl_mar_collections"
        query = f"INSERT INTO capacity_and_vulnerability VALUES (0, '{data['resource']}', {data['quantity']}, '{data['status']}', " \
                f"'{data['owner']}', '{data['in_charge']}', '{data['updater']}', '{data['datetime']}', {data['user_id']}, '{data['last_ts']}')"
        try:
            cav_id = DB.db_modify(query, schema, True)
        except Exception as err:
            raise(err)
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
        query = "UPDATE capacity_and_vulnerability SET "

        end = ""
        counter = 0
        for key, value in data.items():
            if key == "cav_id":
                end = f", last_ts='{dt.now()}' WHERE cav_id={value}"
            else:
                if counter == 0:
                    query += f" {key} = '{value}'"
                else:
                    query += f", {key} = '{value}'"
            counter += 1

        query = f"{query}{end}"
        schema = "cbewsl_mar_collections"
        result = DB.db_modify(query, schema, True)

        return result

    def delete_cav(cav_id):
        query = f'DELETE FROM capacity_and_vulnerability WHERE cav_id = { cav_id }'
        schema = "cbewsl_mar_collections"
        result = DB.db_modify(query, schema, True)
        return result