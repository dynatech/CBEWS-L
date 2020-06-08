import time
import os
from pathlib import Path
from flask import Blueprint, jsonify, request, redirect, url_for, send_from_directory, send_file
from connections import SOCKETIO
from src.model.v2.mar.community_risk_assessment import CommunityRiskAssessment
from src.api.helpers import Helpers as h

from config import APP_CONFIG


COMMUNITY_RISK_ASSESSMENT_BLUEPRINT = Blueprint("capacity_and_vulnerability_blueprint", __name__)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/add/community_risk_assessment/mar/capacity_and_vulnerability", methods=["POST"])
def add_capacity_and_vulnerability():
    temp = request.get_json()
    data = {
        "resource": temp["Resource"],
        "quantity": temp["Quantity"],
        "status": temp["Status"],
        "owner": temp["Owner"],
        "in_charge": temp["Incharge"],
        "updater": temp["Updater"],
        "datetime": temp["Datetime"],
        "user_id": temp["user_id"]
    }

    status = CommunityRiskAssessment.create_cav(data)
    if status is not None:
        return_value = {
            "status": True,
            "cav_id": status,
            "message": "New capacity and vulnerability data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "cav_id": None,
            "message": "Failed to add capacity and vulnerability data. Please check your network connection."
        }
    return jsonify(return_value)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/all/community_risk_assessment/mar/capacity_and_vulnerability", methods=["GET"])
def fetch_all_capacity_and_vulnerability():
    result = CommunityRiskAssessment.fetch_cav('all')
    data = []
    for row in result:
        row.update({
            "datetime": h.dt_to_str(row["date"]),
            "last_ts": h.dt_to_str(row["last_ts"])
        })
        data.append(row)
    return jsonify(data)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/one/community_risk_assessment/mar/capacity_and_vulnerability/<cav_id>", methods=["GET"])
def fetch_one_capacity_and_vulnerability(cav_id):
    result = CommunityRiskAssessment.fetch_cav(cav_id)
    data = []
    for row in result:
        row.update({
            "datetime": h.dt_to_str(row["date"]),
            "last_ts": h.dt_to_str(row["last_ts"])
        })
        data.append(row)
    return jsonify(data)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/update/community_risk_assessment/mar/capacity_and_vulnerability", methods=["POST"])
def modify_capacity_and_vulnerability():
    data = request.get_json()
    print(data)
    result = CommunityRiskAssessment.update_cav(data)
    if result:
        return_value = {
            "status": True,
            "message": "Capacity and vulnerability data successfully updated!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to update capacity and vulnerability data. Please check your network connection."
        }
    return jsonify(return_value)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/delete/community_risk_assessment/mar/capacity_and_vulnerability", methods=["DELETE"])
def remove_capacity_and_vulnerability():
    data = request.get_json()
    status = CommunityRiskAssessment.delete_cav(data)
    if status:
        return_value = {
            "status": True,
            "message": "Capacity and vulnerability data successfully deleted!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to delete capacity and vulnerability data. Please check your network connection."
        }
    return jsonify(return_value)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/community_risk_assessment/mar/community_risk_assessment", methods=["POST"])
def fetch_community_risk_assessment_file():
    data = request.get_json()
    basepath = data['path']
    cra_list = os.listdir(basepath)

    files = []

    for file in cra_list:
        path = os.path.join(basepath, file)
        if not os.path.isdir(path):
            file_type = file.split(".")[1]
            files.append({
                "filename": file,
                "file_type": file_type,
                "file_path": basepath
            })
    # return {"status": True, "data": files}
    return jsonify({"status": True, "data": files})


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/upload/community_risk_assessment/mar/community_risk_assessment", methods=["POST"])
def upload_community_risk_assessment_file():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/"
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

        return_data = { "status": True }
    except Exception as err:
        raise err
        # return_data = { "status": False }

    return jsonify(return_data)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/community_risk_assessment/mar/hazard_map", methods=["GET"])
def fetch_hazard_map():
    file_loc = APP_CONFIG['MARIRONG_DIR']

    basepath = f'{file_loc}/MAPS'
    map_list = os.listdir(basepath)

    maps = []

    for map in map_list:
        # path = os.path.join(basepath, map)
        path = Path(basepath)
        filepath = path / map
        if not os.path.isdir(filepath):
            file_type = map.split(".")[1]
            maps.append({
                "filename": map,
                "file_type": file_type,
                "file_path": basepath
            })

    return jsonify({"status": True, "data": maps})


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/upload/community_risk_assessment/mar/hazard_map", methods=["POST"])
def upload_hazard_map():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['MARIRONG_DIR']}/MAPS/"
        filename = file.filename

        count = filename.count(".")
        name_list = filename.split(".", count)
        file_type = f".{name_list[count]}"
        name_list.pop()
        filename = f"{'.'.join(name_list)}"

        temp = f"{filename}{file_type}"
        uniq = 1
        while os.path.exists(Path(directory) / temp):
            temp = '%s_%d%s' % (filename, uniq, file_type)
            uniq += 1

        file.save(os.path.join(Path(directory), temp))

        return_data = { "status": True }
    except Exception as err:
        # raise err
        return_data = { "status": False }

    return jsonify(return_data)
