from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class DynamicVariables():

    def get_site_dynamic_variables(site_id):
        query = f"SELECT * FROM dynamic_variables WHERE fk_site_id={site_id}"
        
        schema = "cbewsl_commons_db"
        stat_row = DB.db_read(query, schema)

        retun_dict = []
        if stat_row:
            retun_dict = stat_row[0]

        return retun_dict
    
    def update_site_dynamic_variables(site_id):
        query = "UPDATE dynamic_variables SET "
        query = f"{query} "
        query = f"{query} WHERE fk_site_id={site_id}"

        schema = "cbewsl_commons_db"
        var_id = DB.db_modify(query, schema, True)

        return var_id 
