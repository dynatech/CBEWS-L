
import time
import os
from pathlib import Path
from flask import Blueprint, jsonify, request, url_for, send_from_directory, send_file
from src.model.v2.umi.situation_report import SituationReportModel
import hashlib
from src.api.helpers import Helpers as h

from config import APP_CONFIG

SITUATION_REPORT_BLUEPRINT = Blueprint("situation_report_blueprint", __name__)

@SITUATION_REPORT_BLUEPRINT.route("/get/situation_report/umi/latest_report", methods=["GET"])
def get_latest_report_summary():
	try:
		summary = SituationReportModel.fetch_latest_situation_report()
		ret_val = {
			'status': True,
			'message': "Successfully loaded Latest Situation Report",
			'data': summary
		}
	except Exception as err:
		ret_val = {
			'status': False,
			'message': "Failed to get Latest Situation Report."
		}
	return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/download/situation_report/umi/latest_report", methods=["POST"])
def download_latest_report_summary():
	try:
		data = request.get_json()
		# summary = SituationReportModel.fetch_latest_field_survey()
		# ret_val = {
		#     'status': True,
		#     'message': "Successfully loaded Latest Situation Report",
		#     'data': summary
		# }
	except Exception as err:
		ret_val = {
			'status': False,
			'message': "Failed to get Latest Situation Report."
		}
	return jsonify({
		'status': True
	})

@SITUATION_REPORT_BLUEPRINT.route("/email/situation_report/umi/latest_report", methods=["POST"])
def email_latest_report_summary():
	try:
		data = request.get_json()
		# summary = SituationReportModel.fetch_latest_field_survey()
		# ret_val = {
		#     'status': True,
		#     'message': "Successfully loaded Latest Situation Report",
		#     'data': summary
		# }
	except Exception as err:
		ret_val = {
			'status': False,
			'message': "Failed to get Latest Situation Report."
		}
	return jsonify({
		'status': True
	})

@SITUATION_REPORT_BLUEPRINT.route("/get/situation_report/umi/situation_report_logs/<start>/<end>", methods=["GET"])
@SITUATION_REPORT_BLUEPRINT.route("/get/situation_report/umi/situation_report_logs", methods=["GET"])
def get_all_field_survey_logs(start=None, end=None):
	try:
		summary = SituationReportModel.fetch_all_situation_report_logs(start, end)
		ret_val = {
			'status': True,
			'message': "Successfully loaded Latest Situation Report Logs",
			'data': summary
		}
	except Exception as err:
		ret_val = {
			'status': False,
			'message': "Failed to get Latest Situation Report Logs."
		}
	return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/add/situation_report/umi/situation_report_logs", methods=["POST"])
def add_situation_report():
	try:
		data = request.get_json()
		report = SituationReportModel.create_situation_report_logs(data)
		ret_val = {
			'status': True,
			'message': "Successfully added new Latest Situation Report Logs",
			'data': report
		}
	except Exception as err:
		ret_val = {
			'status': False,
			'message': f"Failed to add Latest Situation Report Logs. Err: {err}"
		}
	return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/upload/situation_report/umi/situation_report_logs", methods=["POST"])
def upload_situation_report_log_file():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['UMINGAN_DIR']}/DOCUMENTS/Situation-Reports"
        filename = file.filename

        count = filename.count(".")
        name_list = filename.split(".", count)
        file_type = f".{name_list[count]}"
        name_list.pop()
        filename = f"{'.'.join(name_list)}"

        temp = f"{filename}{file_type}"
        uniq = 1
        while os.path.exists(Path(directory) / temp):
            # filename
            temp = '%s_%d%s' % (filename, uniq, file_type)
            uniq += 1

        # file.save(new_path) 
        file.save(os.path.join(Path(directory), temp))

        return_data = { "status": True, "file_path": f"{directory}/{temp}" }
    except Exception as err:
        raise err
        # return_data = { "status": False }
    return jsonify(return_data)

@SITUATION_REPORT_BLUEPRINT.route("/update/situation_report/umi/attachment", methods=["POST"])
def update_situation_report_attachment():
    try:
        data = request.get_json()
        check_if_same = SituationReportModel.check_file(data['id'])
        if data['file_path']['filename'] in check_if_same[0]['attachment_path']:
            ret_val = {
                'status': True
            }
        else:
            os.remove(check_if_same[0]['attachment_path'])
            ret_val = {
                'status': False
            }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to updated Situation Report. Err: {err}"
        }
    return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/update/situation_report/umi/situation_report_logs", methods=["PATCH"])
def update_situation_report_logs():
	try:
		data = request.get_json()
		report_status = SituationReportModel.modify_situation_report(data)

		if report_status == '0':
			ret_val = {
				'status': True,
				'message': "Successfully updated situation report logs",
			}
		else:
			ret_val = {
				'status': False,
				'message': "Failed to update situation report logs. Check your network connection",
			}
	except Exception as err:
		ret_val = {
			'status': False,
			'message': f"Failed to updated situation report logs. Err: {err}"
		}
	return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/delete/situation_report/umi/situation_report_logs", methods=["DELETE"])
def delete_field_survey_logs():
    try:
        data = request.get_json()
        delete_status = SituationReportModel.remove_situation_report_log(data['id'])

        if delete_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted situation report log",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete situation report log. Check your network connection",
            }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to delete situation report logs. Err: {err}"
        }
    return jsonify(ret_val)