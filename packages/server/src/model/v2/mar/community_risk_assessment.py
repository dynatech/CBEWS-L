from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

schema = "cbewsl_mar_collections"

class CommunityRiskAssessment():

	def create_cav(data):
		query = f"INSERT INTO capacity_and_vulnerability VALUES (0, '{data['resource']}', {data['quantity']}, '{data['status']}', " \
				f"'{data['owner']}', '{data['in_charge']}', '{data['updater']}', '{data['datetime']}', {data['user_id']}, '{str(dt.today())}')"
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
		result = DB.db_read(query, schema)
		return result
	
	def update_cav(data):
		query = "UPDATE capacity_and_vulnerability SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'cav_id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE cav_id = '{x[key]}'"
			else:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
			counter += 1
		ret_val = DB.db_modify(query, schema, True)
		return ret_val

	def delete_cav(cav_id):
		query = f"DELETE FROM capacity_and_vulnerability WHERE cav_id = { cav_id }"
		schema = "cbewsl_mar_collections"
		result = DB.db_modify(query, schema, True)
		return result