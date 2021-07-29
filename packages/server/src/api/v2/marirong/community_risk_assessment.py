import time
import os
import glob
import ntpath
from datetime import datetime
from stat import S_ISREG, ST_CTIME, ST_MODE
from pathlib import Path
from flask import Blueprint, jsonify, request, redirect, url_for, send_from_directory, send_file
from connections import SOCKETIO
from src.model.v2.mar.community_risk_assessment import CommunityRiskAssessment
from src.api.helpers import Helpers as h

from config import APP_CONFIG


COMMUNITY_RISK_ASSESSMENT_BLUEPRINT = Blueprint(
    "capacity_and_vulnerability_blueprint", __name__)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/add/community_risk_assessment/mar/capacity_and_vulnerability", methods=["POST"])
def add_capacity_and_vulnerability():
    data = request.get_json()
    status = CommunityRiskAssessment.create_cav(data)
    if status is not None:
        return_value = {
            "status": True,
            "id": status,
            "message": "New capacity and vulnerability data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "id": None,
            "message": "Failed to add capacity and vulnerability data. Please check your network connection."
        }
    return jsonify(return_value)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/all/community_risk_assessment/mar/capacity_and_vulnerability", methods=["GET"])
def fetch_all_capacity_and_vulnerability():
    try:
        result = CommunityRiskAssessment.fetch_cav()
        data = {
            "status": True,
            "data": result
        }
    except Exception as err:
        data = {
            "status": False,
            "message": f"Failed to fetch capacity and vulnerability data. Err: {err}"
        }
    finally:
        return jsonify(data)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/one/community_risk_assessment/mar/capacity_and_vulnerability/<id>", methods=["GET"])
def fetch_one_capacity_and_vulnerability(id):
    try:
        result = CommunityRiskAssessment.fetch_cav(id)
        data = {
            "status": True,
            "data": result
        }
    except Exception as err:
        data = {
            "status": False,
            "message": "Failed to fetch capacity and vulnerability data"
        }
    finally:
        return jsonify(data)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/update/community_risk_assessment/mar/capacity_and_vulnerability", methods=["PATCH"])
def modify_capacity_and_vulnerability():
    data = request.get_json()
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
    status = CommunityRiskAssessment.delete_cav(data["id"])
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
        file_path = h.upload(file=file, file_path=directory)

        response = {
            "status": True, "message": "CRA File successfully uploaded!", "file_path": file_path}
    except Exception as err:
        # raise err
        print(err)
        response = {"status": False,
                    "message": "Failed uploading CRA file.", "file_path": "null"}
    
    return jsonify(response)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/community_risk_assessment/mar/hazard_map", methods=["GET"])
def fetch_hazard_map():
    try:
        file_loc = APP_CONFIG['MARIRONG_DIR']

        basepath = f'{file_loc}/MAPS'
        # map_list = os.listdir(basepath)
        map_list = glob.glob(basepath+"/*")
        latest_file = max(map_list, key=os.path.getctime)
        latest_file = latest_file.split("\\", 1)
        map_list = [*latest_file]

        entries = ((os.stat(path), path) for path in map_list)
        # leave only regular files, insert creation date
        entries = ((stat[ST_CTIME], path)
                   for stat, path in entries if S_ISREG(stat[ST_MODE]))

        # file timestamp last modified
        ts_last_modified = h.dt_to_str(datetime.fromtimestamp(os.stat(basepath).st_mtime))

        maps = []
        for map in map_list:
            path = Path(basepath)
            filepath = path / map
            if not os.path.isdir(filepath):
                file_type = map.split(".")[1]
                head, filename = ntpath.split(map)
                maps.append({
                    "filename": filename,
                    "file_type": file_type,
                    "file_path": basepath,
                    "ts": ts_last_modified
                })

        response = {"status": True, "data": maps,
                    "message": "Success loading map"}
    except ValueError as val_err:
        print(val_err)
        response = {"status": False, "data": [], "message": "Value Error. See server for details."}
    except Exception as err:
        print(err)
        response = {"status": False, "data": [],
                    "message": "Failed loading map. See server for details"}

    return jsonify(response)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/get/community_risk_assessment/mar/hazard_map/gallery", methods=["GET"])
def fetch_hazard_map_gallery_data():
    try:
        file_loc = APP_CONFIG['MARIRONG_DIR']

        basepath = f'{file_loc}/MAPS'
        map_list = glob.glob(basepath+"/*")

        entries = ((os.stat(path), path) for path in map_list)
        # leave only regular files, insert creation date
        entries = ((stat[ST_CTIME], path)
                   for stat, path in entries if S_ISREG(stat[ST_MODE]))

        # file timestamp last modified
        ts_last_modified = h.dt_to_str(datetime.fromtimestamp(os.stat(basepath).st_mtime))

        maps = []
        for map in map_list:
            path = Path(basepath)
            filepath = path / map
            if not os.path.isdir(filepath):
                file_type = map.split(".")[1]
                head, filename = ntpath.split(map)

                web_host_ip = APP_CONFIG['url']
                path = f"src/client-cbewsl/MARIRONG/MAPS"
                http_path = f"{web_host_ip}:5001/{path}/{filename}"

                maps.append({
                    "original": http_path,
                    "thumbnail": http_path,
                    "ts": ts_last_modified
                })

        response = {"status": True, "data": maps,
                    "message": "Success loading map"}
    except ValueError as val_err:
        print(val_err)
        response = {"status": False, "data": [], "message": "Value Error. See server for details."}
    except Exception as err:
        print(err)
        response = {"status": False, "data": [],
                    "message": "Failed loading map. See server for details"}

    return jsonify(response)


@COMMUNITY_RISK_ASSESSMENT_BLUEPRINT.route("/upload/community_risk_assessment/mar/hazard_map", methods=["POST"])
def upload_hazard_map():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['MARIRONG_DIR']}/MAPS/"
        file_path = h.upload(file=file, file_path=directory)

        response = {
            "status": True, "message": "File successfully uploaded!", "file_path": file_path}
    except Exception as err:
        # raise err
        print(err)
        response = {"status": False,
                    "message": "Failed uploading file.", "file_path": "null"}

    return jsonify(response)
