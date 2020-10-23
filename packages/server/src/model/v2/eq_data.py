from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt

class Earthquake():
	def get_latest_eq_events(limit = 50):
		query = f"""
			SELECT 
				eq_id,
				ts,
				magnitude,
				depth,
				latitude,
				longitude,
				distance,
				CONCAT(IFNULL(CONCAT(purok, ', '), ''),
						IFNULL(CONCAT(sitio, ', '), ''),
						IFNULL(CONCAT(barangay, ', '), ''),
						IFNULL(CONCAT(municipality, ', '), ''),
						IFNULL(province, '')) AS site
			FROM
				earthquake_events
					INNER JOIN
				earthquake_alerts USING (eq_id)
					INNER JOIN
				cbewsl_commons_db.sites USING (site_id)
			ORDER BY ts
			LIMIT {limit}
		"""
		eq_data = DB.db_read(query, 'senslopedb')
		return eq_data

	def get_latest_eq_events_by_site_id(site_id, limit = 50):
		query = f"""
			SELECT 
				eq_id,
				ts,
				magnitude,
				depth,
				latitude,
				longitude,
				distance,
				CONCAT(IFNULL(CONCAT(purok, ', '), ''),
						IFNULL(CONCAT(sitio, ', '), ''),
						IFNULL(CONCAT(barangay, ', '), ''),
						IFNULL(CONCAT(municipality, ', '), ''),
						IFNULL(province, '')) AS site
			FROM
				earthquake_events
					INNER JOIN
				earthquake_alerts USING (eq_id)
					INNER JOIN
				cbewsl_commons_db.sites USING (site_id)
			WHERE
				site_id = {site_id}
			ORDER BY ts
			LIMIT {limit}
		"""
		eq_data = DB.db_read(query, 'senslopedb')
		return eq_data