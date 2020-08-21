from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

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
			if 'id' != key:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
				counter += 1
		
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
		ret_val = DB.db_modify(query, 'CBEWSL_UMI_collections', True)
		return ret_val

	def create_summary(data):
		query = f"INSERT INTO risk_assessment VALUES (0, '{data['location']}', '{data['impact']}', " \
				f"'{data['adaptive_capacity']}', '{data['vulnerability']}', '{str(dt.today())}', '{data['user_id']}')"
		h.var_checker("query", query)
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
			if 'id' != key:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
				counter += 1
		
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
		ret_val = DB.db_modify(query, 'CBEWSL_UMI_collections', True)
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

	def fetch_all_resource_and_capacities():
		query = "SELECT * FROM resource_and_capacities"
		ret_val = DB.db_read(query, 'CBEWSL_UMI_collections')
		return ret_val

	def modify_resource_and_capacities(data):
		query = "UPDATE resource_and_capacities SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' != key:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
				counter += 1
		
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
		ret_val = DB.db_modify(query, 'CBEWSL_UMI_collections', True)
		return ret_val

	def create_resource_and_capacities(data):
		query = f"INSERT INTO resource_and_capacities VALUES (0, '{data['resource_and_capacities']}', '{data['status']}', " \
				f"'{data['owner']}', '{str(dt.today())}', '{data['user_id']}')"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def remove_resource_and_capacities(id):
		query = f"DELETE FROM resource_and_capacities WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def fetch_all_family_risk_profile():
		query = "SELECT * FROM family_risk_profile"
		ret_val = DB.db_read(query, 'CBEWSL_UMI_collections')
		return ret_val

	def modify_family_risk_profile(data):
		query = "UPDATE family_risk_profile SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' != key:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
				counter += 1
		
		for x in data:
			key = list(x)[0]
			if 'id' == key:
				query = f"{query}, last_ts = '{str(dt.today())}' WHERE id = '{x[key]}'"
		ret_val = DB.db_modify(query, 'CBEWSL_UMI_collections', True)
		return ret_val

	def create_family_risk_profile(data):
		query = f"INSERT INTO family_risk_profile VALUES (0, '{data['number_of_members']}', '{data['vulnerable_groups']}', " \
				f"'{data['nature_of_vulnerability']}', '{str(dt.today())}', '{data['user_id']}')"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val

	def remove_family_risk_profile(id):
		query = f"DELETE FROM family_risk_profile WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'CBEWSL_UMI_collections', True)
		return ret_val