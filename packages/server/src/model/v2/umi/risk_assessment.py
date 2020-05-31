from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt

class RiskAssessmentModel():

	def fetch_all_summary():
		query = "SELECT * FROM risk_assessment"
		ret_val = DB.db_read(query, 'CBEWSL_UMI_collections')
		return ret_val

	def fetch_summary(id):
		return result

	def modify_summary(data):
		query = "UPDATE risk_assessment SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
			else:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
			counter += 1
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def create_summary(data):
		query = f"INSERT INTO risk_assessment VALUES (0, '{data['location']}', '{data['impact']}', " \
				f"'{data['adaptive_capacity']}', '{data['vulnerability']}', '{str(dt.today())}', '{data['user_id']}')"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def remove_summary(id):
		query = f"DELETE FROM risk_assessment WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def fetch_all_hazard_data():
		query = "SELECT * FROM hazard_data"
		ret_val = DB.db_read(query, 'CBEWSL_UMI_collections')
		return ret_val

	def modify_hazard_data(data):
		query = "UPDATE hazard_data SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
			else:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
			counter += 1
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def create_hazard_data(data):
		query = f"INSERT INTO hazard_data VALUES (0, '{data['hazard']}', '{data['speed_of_onset']}', " \
				f"'{data['early_warning']}', '{data['impact']}', '{str(dt.today())}', '{data['user_id']}')"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def remove_hazard_data(id):
		query = f"DELETE FROM hazard_data WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val
