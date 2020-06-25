from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class FieldSurveyModel():

	def fetch_latest_field_survey():
		query = "SELECT * FROM field_survey order by report_date desc limit 1;"
		ret_val = DB.db_read(query, 'cbewsl_umi_collections')
		return ret_val