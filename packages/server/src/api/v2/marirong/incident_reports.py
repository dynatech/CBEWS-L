from flask import Blueprint, jsonify, request
from flask_cors import CORS, cross_origin
from connections import SOCKETIO
from src.model.v2.mar.maintenance_logs import Maintenance as maintenance
from src.api.helpers import Helpers as h
from config import APP_CONFIG

INCIDENT_REPORTS_BLUEPRINT = Blueprint("incident_reports_blueprint", __name__)


@INCIDENT_REPORTS_BLUEPRINT.route("/add/maintenance/mar/incident_logs", methods=["POST"])
@cross_origin()
def add():
    data = request.get_json()
    status = maintenance.create_incident_report(data)
    if status is not None:
        return_value = {
            "status": True,
            "id": status,
            "message": "New incident report data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "id": None,
            "message": "Failed to add incident report data. Please check your network connection."
        }
    return jsonify(return_value)

@INCIDENT_REPORTS_BLUEPRINT.route("/fetch/maintenance/mar/incident_logs", methods=["GET"])
@cross_origin()
def fetch():
    try:
        result = maintenance.fetch_incident_report()
        response = {
            "status": True,
            "data": result,
            "message": "Sucessfully fetched incident logs."
        }

    except Exception as err:
        response = {
            "status": False,
            "data": [],
            "message": f"Failed to fetch incident logs. Err: {err}"
        }

    return jsonify(response)


@INCIDENT_REPORTS_BLUEPRINT.route("/update/maintenance/mar/incident_logs", methods=["PATCH"])
@cross_origin()
def modify():
    data = request.get_json()
    result = maintenance.update_incident_report(data)
    try:
        if result == "0":
            return_value = {
                "status": True,
                "message": "Incident report data successfully updated!"
            }
        else:
            return_value = {
                "status": False,
                "message": "Failed to update incident reports data. Please check your network connection."
            }
    except Exception as err:
        return_value = {
            "status": False,
            "message": f"Failed to update incident reports data. Err: {err}"
        }
    return jsonify(return_value)

@INCIDENT_REPORTS_BLUEPRINT.route("/delete/maintenance/mar/incident_logs", methods=["DELETE"])
@cross_origin()
def remove():
    data = request.get_json()
    status = maintenance.delete_incident_report(data['id'])
    if status is not None:
        return_value = {
            "status": True,
            "message": "Maintenance log data successfully deleted!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to delete incident report data. Please check your network connection."
        }
    return jsonify(return_value)


@INCIDENT_REPORTS_BLUEPRINT.route("/maintenance/incident_reports/upload_report_attachment", methods=["POST"])
@cross_origin()
def upload_report_attachment():
    try:
        file = request.files['file']

        h.var_checker("request.form", request.form, True)
        form_json = request.form.to_dict(flat=False)
        ir_id = form_json["ir_id"][0]
        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/INCIDENT_REPORTS/{ir_id}/"
        final_path = h.upload(file=file, file_path=file_path)

        response = {
            "ok": True,
            "message": "Report attachment OKS!",
            "file_path": final_path
        }

    except Exception as err:
        print(err)
        response = {
            "ok": False,
            "message": "Report attachment NOT oks!",
            "file_path": "ERROR"
        }

    return jsonify(response)


@INCIDENT_REPORTS_BLUEPRINT.route("/maintenance/incident_reports/fetch_report_attachments/<ir_id>", methods=["GET"])
@cross_origin()
def fetch_report_attachments(ir_id):
    try:

        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/INCIDENT_REPORTS/{ir_id}/"
        files = h.fetch(file_path)

        response = {
            "ok": True,
            "message": "Report attachment fetch OKS!",
            "data": files
        }

    except Exception as err:
        print(err)
        response = {
            "ok": False,
            "message": "Report attachment fetch NOT oks!",
            "data": files
        }

    return jsonify(response)