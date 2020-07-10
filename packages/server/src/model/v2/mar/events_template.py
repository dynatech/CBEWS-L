from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h

class EventsTemplate():

	def create_events_template(data):
		query = f"INSERT INTO events_template VALUES (0, '{data['template_name']}', '{data['message_template']}', '{data['user_id']}', '{str(dt.today())}')"
		events_id = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return events_id
	
	def fetch_events_templates():
		query = 'SELECT * FROM events_template'
		events_template = DB.db_read(query, 'cbewsl_mar_collections')
		return events_template
	
	def update_events_templates(data):
		query = f"UPDATE events_template SET template_name='{data['template_name']}', message_template='{data['message_template']}', " \
				f"user_id='{data['user_id']}', last_ts='{str(dt.today())}' WHERE id='{data['id']}'"
		events_template = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return events_template

	def delete_events_templates(data):
		query = f"DELETE FROM events_template WHERE id='{data['id']}'"
		events_template = DB.db_modify(query, 'cbewsl_mar_collections', True)
		return events_template