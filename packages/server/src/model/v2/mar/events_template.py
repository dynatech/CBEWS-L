from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class EventsTemplate():

	def create_events_template(data):
		query = f"INSERT INTO events_template VALUES (0, '{data['template_name']}', '{data['message_template']}', '{data['user_id']}', '{str(dt.today())}')"
		maintenance_log_id = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return maintenance_log_id
	
	def fetch_events_templates():
		query = 'SELECT * FROM events_template'
		events_template = DB.db_read(query, 'cbewsl_mar_collections')
		return events_template