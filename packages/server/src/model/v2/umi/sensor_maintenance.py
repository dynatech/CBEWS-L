from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class SensorMaintenanceModel():

	def create_sensor_maintenance_log(data):
		h.var_checker("data", data)
		remarks = data["remarks"] 
		working_nodes = data["working_nodes"] 
		anomalous_nodes = data["anomalous_nodes"] 
		rain_gauge_status = data["rain_gauge_status"] 
		timestamp = data["timestamp"]

		query = f"INSERT INTO sensor_maintenance (remarks, working_nodes, anomalous_nodes, rain_gauge_status, timestamp, last_ts) " \
				f"VALUES ('{remarks}', {working_nodes}, {anomalous_nodes}, '{rain_gauge_status}', '{timestamp}', '{str(dt.today())}')"
		maintenance_log_id = DB.db_modify(query, 'cbewsl_umi_collections', True)
		return maintenance_log_id

	def fetch_filtered_sensor_maintenance_log(start, end):
		query = 'SELECT * FROM sensor_maintenance WHERE'
		query = f"{query} timestamp BETWEEN '{start}'AND '{end}'"
		print(query)

		result = DB.db_read(query, 'cbewsl_umi_collections')
		return result

	def fetch_all_sensor_maintenance_log():
		query = 'SELECT * FROM sensor_maintenance'
		result = DB.db_read(query, 'cbewsl_umi_collections')

		return result

	def update_sensor_maintenance_log(data):
		query = "UPDATE sensor_maintenance SET"
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
		ret_val = DB.db_modify(query, 'cbewsl_umi_collections', True)
		return ret_val

	def delete_sensor_maintenance_log(id):
		query = f'DELETE FROM sensor_maintenance WHERE id = { id }'
		result = DB.db_modify(query, 'cbewsl_umi_collections', True)
		return result
