from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class SituationReportModel():

	def fetch_latest_situation_report():
		query = "SELECT * FROM situation_report order by report_ts desc limit 1;"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val

	def fetch_all_situation_report_logs(start=None, end=None):
		query = "SELECT * FROM situation_report"
		if (start and end):
			query += f" WHERE report_ts BETWEEN '{start}' AND '{end}'"

		query += " ORDER BY report_ts DESC"

		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val
		
	def create_situation_report_logs(data):
		query = f"INSERT INTO situation_report VALUES (0, '{data['report_ts']}', '{data['report_summary']}', " \
				f"'{data['attachment_path']}', '{data['user_id']}' , '{str(dt.today())}')"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def modify_situation_report(data):
		query = "UPDATE situation_report SET"
		counter = 0
		for x in data:
			key = list(x)[0]
			if 'id' != key:
				if counter == 0:
					query += f" {key} = '{x[key]}'"
				else:
					query += f", {key} = '{x[key]}'"
			counter += 1
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val
	def remove_situation_report_log(id):
		query = f"DELETE FROM situation_report WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def check_file(id):
		query = f"SELECT attachment_path FROM situation_report WHERE id='{id}'"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val