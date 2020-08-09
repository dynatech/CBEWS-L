from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class Maintenance():

	def create_maintenance_log(data):
		h.var_checker("data", data)
		query = f'INSERT INTO maintenance_logs (maintenance_date, type, remarks, in_charge, updater, user_id, last_ts) ' \
				f"VALUES ('{data['maintenance_date']}', '{data['type']}', '{data['remarks']}', '{data['in_charge']}', '{data['updater']}', '{data['user_id']}', '{str(dt.today())}')"
		maintenance_log_id = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return maintenance_log_id

	def fetch_filtered_maintenance_log(start, end):
		query = 'SELECT * FROM maintenance_logs WHERE'
		query = f"{query} maintenance_date BETWEEN '{start}'AND '{end}'"
		print(query)

		result = DB.db_read(query, 'cbewsl_mar_collections')
		return result

	def fetch_all_maintenance_log():
		query = 'SELECT * FROM maintenance_logs'
		result = DB.db_read(query, 'cbewsl_mar_collections')

		return result

	def update_maintenance_log(data):
		query = "UPDATE maintenance_logs SET"
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
		ret_val = DB.db_modify(query,'cbewsl_mar_collections', True)
		return ret_val
		

	def delete_maintenance_log(id):
		query = f'DELETE FROM maintenance_logs WHERE id = { id }'
		result = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return result

	##########################
	# INCIDENT REPORT MODELS #
	##########################

	def create_incident_report(data):
		query = f'INSERT INTO incident_logs (incident_date, incident_report_narrative, reporter, user_id, last_ts) ' \
				f'VALUES ("{data["incident_date"]}", "{data["incident_report_narrative"]}", "{data["reporter"]}", "{data["user_id"]}", "{str(dt.today())}")'
		print(query)
		ir_id = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return ir_id

	def fetch_filtered_incident_report(start, end):
		query = 'SELECT * FROM incident_logs WHERE'
		query = f"{query} incident_date BETWEEN '{start}'AND '{end}'"
		h.var_checker("query", query)
		result = DB.db_read(query, 'cbewsl_mar_collections')
		return result

	def fetch_all_incident_report():
		query = 'SELECT * FROM incident_logs'
		result = DB.db_read(query, 'cbewsl_mar_collections')
		return result

	def update_incident_report(data):
		query = "UPDATE incident_logs SET"
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
		ret_val = DB.db_modify(query,'cbewsl_mar_collections', True)
		return ret_val

	def delete_incident_report(id):
		query = f'DELETE FROM incident_logs WHERE id = { id }'
		result = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return result
