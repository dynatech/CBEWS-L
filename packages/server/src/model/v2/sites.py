from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt

class Sites():

	def get_site_details(filter_value, site_filter="site_id", return_col=None):
		"""
        Returns row of sites

        Args:
            site_filter (Str): site_id or site_code
            filter_value (Str or Int): int or str
		"""
		option = "*, sites.id AS site_id"
		if return_col:
			if return_col == "site_id":
				option = "sites.id as site_id"
			else:
				option = return_col
		
		if site_filter == "site_id":
			site_filter = "id"

		query = f"SELECT {option} FROM sites WHERE {site_filter} = '{filter_value}'"
		result = DB.db_read(query, 'senslopedb')

		if result: 
			result = result[0]
			if return_col:
				result = result[return_col]

		return result