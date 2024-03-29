"""
Main application file
Contains initialization lines for main project methods
"""

import datetime

from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from pprint import pprint
from config import APP_CONFIG
from flask_talisman import Talisman
from flask_sslify import SSLify

BCRYPT = Bcrypt()
JWT = JWTManager()
SOCKETIO = SocketIO()

def create_app():
	"""
	Instantiate Flask App variable and other related packages
	"""

	app = Flask(__name__, instance_relative_config=True)

	app.config.from_pyfile("config.py")

	JWT.init_app(app)
	app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=30)
	CORS(app)
	SOCKETIO.init_app(app)
	Talisman(app)
	SSLify(app)

	# from src.api.users.user_account import USER_ACCOUNT_BLUEPRINT
	# app.register_blueprint(USER_ACCOUNT_BLUEPRINT, url_prefix="/api")

	# from src.api.users.user import USER_BLUEPRINT
	# app.register_blueprint(USER_BLUEPRINT, url_prefix="/api")

	# from src.api.risk_assessment.cav import CAPACITY_AND_VULNERABILITY_BLUEPRINT
	# app.register_blueprint(CAPACITY_AND_VULNERABILITY_BLUEPRINT, url_prefix="/api")

	# from src.api.risk_assessment.cra import COMMUNITY_RISK_ASSESSMENT_BLUEPRINT
	# app.register_blueprint(COMMUNITY_RISK_ASSESSMENT_BLUEPRINT, url_prefix="/api")

	# from src.api.ground_data.surficial_markers import SURFICIAL_MARKERS_BLUEPRINT
	# app.register_blueprint(SURFICIAL_MARKERS_BLUEPRINT, url_prefix="/api")

	# from src.api.ground_data.manifestation_of_movements import MANIFESTATION_OF_MOVEMENTS_BLUEPRINT
	# app.register_blueprint(MANIFESTATION_OF_MOVEMENTS_BLUEPRINT, url_prefix="/api")

	# from src.api.alert_generation.public_alerts import PUBLIC_ALERTS_BLUEPRINT
	# app.register_blueprint(PUBLIC_ALERTS_BLUEPRINT, url_prefix="/api")

	# from src.api.data_analysis.rainfall_analysis import RAINFALL_ANALYSIS_BLUEPRINT
	# app.register_blueprint(RAINFALL_ANALYSIS_BLUEPRINT, url_prefix="/api")

	# from src.api.data_analysis.surficial_analysis import SURFICIAL_ANALYSIS_BLUEPRINT
	# app.register_blueprint(SURFICIAL_ANALYSIS_BLUEPRINT, url_prefix="/api")

	# from src.api.data_analysis.subsurface_analysis import SUBSURFACE_ANALYSIS_BLUEPRINT
	# app.register_blueprint(SUBSURFACE_ANALYSIS_BLUEPRINT, url_prefix="/api")

	# from src.api.sensor_data.earthquake import EARTHQUAKE_BLUEPRINT
	# app.register_blueprint(EARTHQUAKE_BLUEPRINT, url_prefix="/api")

	#from src.api.maintenance.maintenance_logs import MAINTENANCE_LOGS_BLUEPRINT
	#app.register_blueprint(MAINTENANCE_LOGS_BLUEPRINT, url_prefix="/api")

	# from src.api.maintenance.incident_reports import INCIDENT_REPORTS_BLUEPRINT
	# app.register_blueprint(INCIDENT_REPORTS_BLUEPRINT, url_prefix="/api")

	from src.api.reports import REPORTS_BLUEPRINT
	app.register_blueprint(REPORTS_BLUEPRINT, url_prefix="/api")

	# from src.api.events.template_creator import TEMPLATE_CREATOR_BLUEPRINT
	# app.register_blueprint(TEMPLATE_CREATOR_BLUEPRINT, url_prefix="/api")

	# from src.api.ground_data.on_demand import ON_DEMAND_BLUEPRINT
	# app.register_blueprint(ON_DEMAND_BLUEPRINT, url_prefix="/api")

	# from src.api.risk_assessment.hazard_maps import HAZARD_MAPS_BLUEPRINT
	# app.register_blueprint(HAZARD_MAPS_BLUEPRINT, url_prefix="/api")
	
	from src.api.test import TEST_BLUEPRINT
	app.register_blueprint(TEST_BLUEPRINT, url_prefix="/test")

	#V2

	from src.api.v2.users.user_management import USER_MANAGEMENT_BLUEPRINT
	app.register_blueprint(USER_MANAGEMENT_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.marirong.community_risk_assessment import COMMUNITY_RISK_ASSESSMENT_BLUEPRINT
	app.register_blueprint(COMMUNITY_RISK_ASSESSMENT_BLUEPRINT, url_prefix="/v2")
	
	from src.api.v2.umi.risk_assessment import RISK_ASSESSMENT_BLUEPRINT
	app.register_blueprint(RISK_ASSESSMENT_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.marirong.maintenance_logs import MAINTENANCE_LOGS_BLUEPRINT
	app.register_blueprint(MAINTENANCE_LOGS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.marirong.incident_reports import INCIDENT_REPORTS_BLUEPRINT
	app.register_blueprint(INCIDENT_REPORTS_BLUEPRINT, url_prefix="/v2")
	
	from src.api.v2.alert_generation.public_alerts import PUBLIC_ALERTS_BLUEPRINT
	app.register_blueprint(PUBLIC_ALERTS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.ground_data.manifestation_of_movements import MANIFESTATION_OF_MOVEMENTS_BLUEPRINT
	app.register_blueprint(MANIFESTATION_OF_MOVEMENTS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.ground_data.on_demand import ON_DEMAND_BLUEPRINT
	app.register_blueprint(ON_DEMAND_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.marirong.events_template import EVENTS_TEMPLATE_BLUEPRINT
	app.register_blueprint(EVENTS_TEMPLATE_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.umi.field_survey import FIELD_SURVEY_BLUEPRINT
	app.register_blueprint(FIELD_SURVEY_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.umi.situation_report import SITUATION_REPORT_BLUEPRINT
	app.register_blueprint(SITUATION_REPORT_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.file_management.file_management import FILE_MANAGEMENT_BLUEPRINT
	app.register_blueprint(FILE_MANAGEMENT_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.ground_data.surficial_markers import SURFICIAL_MARKERS_BLUEPRINT
	app.register_blueprint(SURFICIAL_MARKERS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.data_analysis.surficial_analysis import SURFICIAL_ANALYSIS_BLUEPRINT
	app.register_blueprint(SURFICIAL_ANALYSIS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.data_analysis.rainfall_analysis import RAINFALL_ANALYSIS_BLUEPRINT
	app.register_blueprint(RAINFALL_ANALYSIS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.data_analysis.subsurface_analysis import SUBSURFACE_ANALYSIS_BLUEPRINT
	app.register_blueprint(SUBSURFACE_ANALYSIS_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.umi.sensor_maintenance import SENSOR_MAINTENANCE_BLUEPRINT
	app.register_blueprint(SENSOR_MAINTENANCE_BLUEPRINT, url_prefix="/v2")

	from src.api.v2.sensor_data.earthquake import EARTHQUAKE_BLUEPRINT
	app.register_blueprint(EARTHQUAKE_BLUEPRINT, url_prefix="/v2")

	return app
