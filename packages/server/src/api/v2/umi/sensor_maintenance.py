import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from datetime import datetime
from calendar import monthrange
from werkzeug.datastructures import ImmutableMultiDict
from flask_cors import CORS, cross_origin
from connections import SOCKETIO

from fpdf import FPDF, HTMLMixin

from src.model.v2.umi.sensor_maintenance import SensorMaintenanceModel
from src.api.helpers import Helpers as helpers
from src.api.v2.file_management.file_management import (
    write_pdf_internal
)
from config import APP_CONFIG


SENSOR_MAINTENANCE_BLUEPRINT = Blueprint(
    "sensor_maintenance_blueprint", __name__)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/add/sensor_maintenance/umi/logs", methods=["POST"])
@cross_origin()
def add():
    data = request.get_json()
    response = SensorMaintenanceModel.create_sensor_maintenance_log(data)
    if response:
        return_value = {
            "status": True,
            "maintenance_log_id": response,
            "message": "New sensor maintenance log data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "maintenance_log_id": None,
            "message": "Failed to add sensor maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/fetch/sensor_maintenance/umi/logs", methods=["GET"])
@cross_origin()
def fetch():
    try:
        result = SensorMaintenanceModel.fetch_all_sensor_maintenance_log()
        for x in result:
            x["working_nodes"] = int(x["working_nodes"])
            x["anomalous_nodes"] = int(x["anomalous_nodes"])
            x['timestamp'] = str(x['timestamp'])
            x['last_ts'] = str(x['last_ts'])
        response = {
            "status": True,
            "message": 'Successfully fetch sensor sensor maintenance logs.',
            "data": result
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching sensor maintenance logs. Err: {err}'
        }

    return jsonify(response)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/fetch/day/sensor_maintenance/umi/logs/<input_date>", methods=["GET"])
@cross_origin()
def fetch_day(input_date):
    try:
        input_date = helpers.str_to_dt(input_date)
        start = datetime(input_date.year, input_date.month, input_date.day, 0, 0, 0)
        end = datetime(input_date.year, input_date.month, input_date.day, 23, 59, 0)

        result = SensorMaintenanceModel.fetch_filtered_sensor_maintenance_log(start, end)
        response = {
            "status": True,
            "data": result,
            "message": "Sucessfully fetched day sensor maintenance logs."
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching day sensor maintenance logs. Err: {err}'
        }

    return jsonify(response)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/fetch/month/sensor_maintenance/umi/logs/<start>/<end>", methods=["GET"])
@cross_origin()
def fetch_month(start, end):
    try:
        result = SensorMaintenanceModel.fetch_filtered_sensor_maintenance_log(start, end)
        response = {
            "status": True,
            "message": 'Successfully fetch month sensor maintenance logs.',
            "data": result
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching month sensor maintenance logs. Err: {err}'
        }  
        raise

    return jsonify(response)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/update/sensor_maintenance/umi/logs", methods=["PATCH"])
@cross_origin()
def update():
    data = request.get_json()
    result = SensorMaintenanceModel.update_sensor_maintenance_log(data)
    if result is not None:
        return_value = {
            "status": True,
            "message": "Maintenance logs data successfully updated!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to update sensor maintenance logs data. Please check your network connection."
        }
    return jsonify(return_value)


@SENSOR_MAINTENANCE_BLUEPRINT.route("/delete/sensor_maintenance/umi/logs", methods=["DELETE"])
@cross_origin()
def remove():
    data = request.get_json()
    status = SensorMaintenanceModel.delete_sensor_maintenance_log(data['id'])
    if status == "0":
        return_value = {
            "status": True,
            "message": "Maintenance log data successfully deleted!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to delete maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


# @SENSOR_MAINTENANCE_BLUEPRINT.route("/maintenance/maintenance_logs/upload_log_attachment", methods=["POST"])
# @cross_origin()
# def upload_log_attachment():
#     try:
#         file = request.files['file']
#         form_json = request.form.to_dict(flat=False)
#         maintenance_log_id = form_json["maintenance_log_id"][0]
#         file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
#         final_path = helpers.upload(file=file, file_path=file_path)

#         response = {
#             "status": True,
#             "message": "Log attachment OKS!",
#             "file_path": final_path
#         }

#     except Exception as err:
#         print(err)
#         response = {
#             "status": False,
#             "message": "Log attachment NOT oks!",
#             "file_path": "ERROR"
#         }

#     return jsonify(response)


# @SENSOR_MAINTENANCE_BLUEPRINT.route("/maintenance/maintenance_logs/fetch_log_attachments/<maintenance_log_id>", methods=["GET"])
# @cross_origin()
# def fetch_log_attachments(maintenance_log_id):
#     try:

#         file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
#         files = helpers.fetch(file_path)

#         response = {
#             "status": True,
#             "message": "Log attachment fetch OKS!",
#             "data": files
#         }

#     except Exception as err:
#         print(err)
#         response = {
#             "status": False,
#             "message": "Log attachment fetch NOT oks!",
#             "data": []
#         }

#     return jsonify(response)


# @SENSOR_MAINTENANCE_BLUEPRINT.route("/write/maintenance_log/pdf", methods=["POST"])
# def write_maintenance_log_pdf():
#     try:
#         json = request.get_json()

#         json["directory"] = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/"
#         response = write_pdf_internal(json)

#     except Exception as err:
#         print(err)

#     return jsonify(response)
