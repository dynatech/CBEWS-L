from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class SensorMaintenanceModel():

	def fetch_latest_sensor_maintenance_log():
		query = "SELECT * FROM sensor_maintenance ORDER BY timestamp DESC LIMIT 1"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val

	def fetch_sensor_maintenance_logs():
		query = "SELECT * FROM sensor_maintenance ORDER BY timestamp DESC"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val

	def create_sensor_maintenance_log(data):
		# query = f"INSERT INTO sensor_maintenance VALUES (0, '{data['timestamp']}', '{data['feature']}', " \
		# 		f"'{data['materials_characterization']}','{data['mechanism']}', '{data['exposure']}', " \
		# 		f"'{data['report_narrative']}', '{data['reporter']}', '{data['attachment_path']}', '{data['user_id']}', " \
		# 		f"'{str(dt.today())}')"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def modify_sensor_maintenance_logs(data):
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
				query = f"{query}, last_ts = '{h.dt_to_str(dt.today())}' WHERE id = {int(x[key])}"
		ret_val = DB.db_modify(query, 'cbewsl_umi_collections', True)
		return ret_val

	def remove_sensor_maintenance_logs(id):
		query = f"DELETE FROM sensor_maintenance WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def check_file(id):
		query = f"SELECT attachment_path FROM sensor_maintenance WHERE id='{id}'"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val