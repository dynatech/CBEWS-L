
import time
import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from src.model.v2.umi.sensor_maintenance import SensorMaintenanceModel
import hashlib
from src.api.helpers import Helpers as h
from pprint import pprint

from config import APP_CONFIG

SENSOR_MAINTENANCE_BLUEPRINT = Blueprint("sensor_maintenance", __name__)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/get/field_survey/umi/latest_report", methods=["GET"])
def get_latest_report_summary():
    try:
        summary = SensorMaintenanceModel.fetch_latest_sensor_maintenance_log()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Latest Field Survey Report",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify(ret_val)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/download/field_survey/umi/latest_report", methods=["POST"])
def download_latest_report_summary():
    try:
        data = request.get_json()
        print(data)
        # summary = SensorMaintenanceModel.fetch_latest_sensor_maintenance_log()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Field Survey Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify({
        'status': True
    })

@SENSOR_MAINTENANCE_BLUEPRINT.route("/email/field_survey/umi/latest_report", methods=["POST"])
def email_latest_report_summary():
    try:
        data = request.get_json()
        print(data)
        # summary = SensorMaintenanceModel.fetch_latest_sensor_maintenance_log()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Field Survey Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify({
        'status': True
    })

@SENSOR_MAINTENANCE_BLUEPRINT.route("/get/field_survey/umi/field_survey_logs", methods=["GET"])
def get_all_sensor_maintenance_logs_logs():
    try:
        summary = SensorMaintenanceModel.fetch_sensor_maintenance_logs()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Latest Field Survey Logs",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Logs."
        }
    return jsonify(ret_val)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/add/field_survey/umi/field_survey_logs", methods=["POST"])
def add_sensor_maintenance_logs_logs():
    try:
        data = request.get_json()
        h.var_checker("data", data)
        summary = SensorMaintenanceModel.create_sensor_maintenance_log(data)
        ret_val = {
            'status': True,
            'message': "Successfully added new Latest Field Survey Logs",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to add Field Survey Logs."
        }
    return jsonify(ret_val)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/update/field_survey/umi/field_survey_logs", methods=["PATCH"])
def update_sensor_maintenance_logs_logs():
    try:
        data = request.get_json()
        summary_status = SensorMaintenanceModel.modify_sensor_maintenance_logs(data)

        if summary_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully updated field survey log",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update field survey log. Check your network connection",
            }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to updated Field Survey Logs. Err: {err}"
        }
    return jsonify(ret_val)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/delete/field_survey/umi/field_survey_logs", methods=["DELETE"])
def delete_sensor_maintenance_logs_logs():
    try:
        data = request.get_json()
        summary_status = SensorMaintenanceModel.remove_sensor_maintenance_logs(data['id'])

        if summary_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted field survey log",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete field survey log. Check your network connection",
            }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to delete Field Survey Logs. Err: {err}"
        }
    return jsonify(ret_val)

@SENSOR_MAINTENANCE_BLUEPRINT.route("/upload/field_survey/umi/field_survey_logs", methods=["POST"])
def upload_sensor_maintenance_logs_logs():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['UMINGAN_DIR']}/DOCUMENTS/Field-Survey"
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

@SENSOR_MAINTENANCE_BLUEPRINT.route("/update/field_survey/umi/attachment", methods=["POST"])
def update_sensor_maintenance_logs_attachment():
    try:
        data = request.get_json()
        check_if_same = SensorMaintenanceModel.check_file(data['id'])
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
            'message': f"Failed to updated Field Survey Logs. Err: {err}"
        }
    return jsonify(ret_val)