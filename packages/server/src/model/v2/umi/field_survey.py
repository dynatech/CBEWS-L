from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class FieldSurveyModel():

	def fetch_latest_field_survey():
		query = "SELECT * FROM field_survey ORDER BY report_date DESC LIMIT 1"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val

	def fetch_field_survey_logs(start=None, end=None):
		query = "SELECT * FROM field_survey"
		if (start and end):
			query += f" WHERE report_date BETWEEN '{start}' AND '{end}'"

		query += " ORDER BY report_date DESC"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val

	def create_field_survey_log(data):
		query = f"INSERT INTO field_survey VALUES (0, '{data['report_date']}', '{data['feature']}', " \
				f"'{data['materials_characterization']}','{data['mechanism']}', '{data['exposure']}', " \
				f"'{data['report_narrative']}', '{data['reporter']}', '{data['attachment_path']}', '{data['user_id']}', " \
				f"'{str(dt.today())}')"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def modify_field_survey_logs(data):
		query = "UPDATE field_survey SET"
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

	def remove_field_survey_logs(id):
		query = f"DELETE FROM field_survey WHERE id = '{id}'"
		ret_val = DB.db_modify(query,'cbewsl_umi_collections', True)
		return ret_val

	def check_file(id):
		query = f"SELECT attachment_path FROM field_survey WHERE id='{id}'"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val