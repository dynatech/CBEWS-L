from src.model.helper.utils import DatabaseConnection as DB
from src.model.v2.sites import Sites
from datetime import datetime as dt
import hashlib

class Users():

	def create_user_account(data):
		try:
			firstname, lastname, middlename, \
			mobile_number, email, age, gender, username, \
			password, cpassword, site, \
			org = data.values()
		except ValueError:
			email = None
			site = data["site"]
			org = data["org"]
			username = data["username"]
			password = data["password"]
			mobile_number = data["mobile_number"]

		salt =  str(hashlib.md5(str(dt.today()).encode("utf-8")).hexdigest())
		password = str(hashlib.sha512(str(password+salt).encode("utf-8")).hexdigest())
		profile_id = Users.create_user_profile(firstname, lastname, middlename,
													age, gender, email)
		mobile_id = Users.create_user_mobile(mobile_number)
		site_id = Sites.get_site_details(site, 'site_code')['site_id']
		role_id = Users.get_role_privilige(org)

		query = f"INSERT INTO user_accounts VALUES (0, {profile_id}, {site_id}, {role_id}, {mobile_id}, '{username}', '{password}', '{salt}')"
		user_id = DB.db_modify(query, 'cbewsl_commons_db', True)

		if user_id:
			status = {
				"status": True,
				"user_id": user_id,
				"message": "Successfully created CBEWS-L Account"
			}
		else:
			status = {
				"status": False,
				"message": "Failed to create CBEWS-L Account. Please contact the Administrator"
			}
		return status

	def get_gsm_id(sim_num):
		"""
		Checks sim_num if Smart Globe
		"""
		num_length = len(sim_num)
		gsm_id = 0
		prefix = "000"
		if num_length > 0:
			if num_length == 11:
				prefix = sim_num[1:4]
				remaining_number = sim_num[2:11]
			elif num_length == 10:
				prefix = sim_num[0:3]
				remaining_number = sim_num[1:10]
			elif num_length == 12:
				prefix = sim_num[2:5]
				remaining_number = sim_num[3:12]
			else:
				print(Exception("Invalid mobile number length"))

		query = f"SELECT gsm_id FROM sim_prefixes WHERE prefix = {prefix}"
		gsm_id = DB.db_read(query, 'comms_db')[0]["gsm_id"]

		return gsm_id, f"639{remaining_number}"

	def get_role_privilige(org):
		query = f"SELECT id AS role_id FROM user_roles WHERE role_title = '{org}'"
		ret_val = DB.db_read(query, 'cbewsl_commons_db')[0]["role_id"]
		return ret_val

	def create_user_mobile(mobile_number):
		query = f"INSERT INTO user_mobiles VALUES (0, 0, '63{mobile_number[:10]}')"
		mobile_id = DB.db_modify(query,'cbewsl_commons_db', True)
		return mobile_id
	
	def create_user_profile(firstname, lastname, middlename,
							age, gender, email):
		query = f"INSERT INTO user_profiles VALUES (0, '{firstname}','{lastname}', '{middlename}', {age}, '{gender}', '{email}')"
		profile_id = DB.db_modify(query,'cbewsl_commons_db', True)
		return profile_id

	def account_exists(username):
		query = ('SELECT COUNT(*) FROM user_accounts WHERE username = "%s"') % username
		count = DB.db_read(query, 'cbewsl_commons_db')
		return count

	def fetch_account(username):
		uery = f"""
			SELECT
				user_accounts.id as user_id, 
				profile_id, site_id, role_id,
				mobile_id, username, password,
				salt, firstname, lastname,
				middlename, age, gender,
				email, gsm_id, mobile_number,
				role_title, role_restrictions
			FROM
				user_accounts 
			INNER JOIN
				user_profiles
				ON (user_profiles.id = user_accounts.profile_id) 
			INNER JOIN
				user_mobiles
				ON (user_mobiles.id = user_accounts.mobile_id)
			INNER JOIN user_roles
				ON (user_roles.id = user_accounts.role_id) 
			WHERE username = '{username}'"""
		account = DB.db_read(query, 'cbewsl_commons_db')
		return account

	def fetch_user(profile_id):
		query = "SELECT firstname, lastname FROM cbewsl_commons_db.user_profiles as cdb_up " \
				"INNER JOIN cbewsl_commons_db.user_accounts as cdb_ua " \
				"ON (cdb_ua.profile_id = cdb_up.id)" \
				f"WHERE cdb_up.id = {profile_id}"
		user = DB.db_read(query, 'cbewsl_commons_db')
		return user
