
import time
import os
import glob
import ntpath
from datetime import datetime
from pathlib import Path
from flask import Blueprint, jsonify, request
from src.model.v2.umi.risk_assessment import RiskAssessmentModel
import hashlib
from src.api.helpers import Helpers as h

from config import APP_CONFIG

RISK_ASSESSMENT_BLUEPRINT = Blueprint("risk_assessment_blueprint", __name__)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/summary", methods=["GET"])
def get_all_summary():
    try:
        summary = RiskAssessmentModel.fetch_all_summary()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Risk Assessment Summary",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Risk Assessment Summary: {err}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/summary/<id>", methods=["GET"])
def get_summary(id):
    print(id)
    return jsonify({'status': True})

@RISK_ASSESSMENT_BLUEPRINT.route("/add/risk_assessment/umi/summary", methods=["POST"])
def add_summary():
    try:
        data = request.get_json()
        request_data = {
            'location': data['Location'],
            'impact': data['Impact'],
            'adaptive_capacity': data['AdaptiveCapacity'],
            'vulnerability': data['Vulnerability'],
            'user_id': data['user_id']
        }
        summary_id = RiskAssessmentModel.create_summary(request_data)
        ret_val = {
            'status': True,
            'message': "Successfully created new Risk Assessment Summary",
            'summary_id': summary_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert Risk Assessment Summary: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/update/risk_assessment/umi/summary", methods=["PATCH"])
def update_summary():
    try:
        data = request.get_json()
        summary_status = RiskAssessmentModel.modify_summary(data)
        if summary_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully updated Risk Assessment Summary",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update Risk Assessment Summary. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert Risk Assessment Summary: {e}"
        }
    return jsonify(ret_val)


@RISK_ASSESSMENT_BLUEPRINT.route("/delete/risk_assessment/umi/summary", methods=["DELETE"])
def delete_summary():
    try:
        data = request.get_json()
        summary_status = RiskAssessmentModel.remove_summary(data['id'])
        if summary_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted Risk Assessment Summary",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete Risk Assessment Summary. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert Risk Assessment Summary: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/hazard_data", methods=["GET"])
def get_all_hazard_data():
    try:
        hazard_data = RiskAssessmentModel.fetch_all_hazard_data()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Hazard Data",
            'data': hazard_data
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get Hazard Data: {err}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/add/risk_assessment/umi/hazard_data", methods=["POST"])
def add_hazard_data():
    try:
        data = request.get_json()
        request_data = {
            'hazard': data['Hazard'],
            'speed_of_onset': data['SpeedofOnset'],
            'early_warning': data['EarlyWarning'],
            'impact': data['Impact'],
            'user_id': data['user_id']
        }
        hazard_id = RiskAssessmentModel.create_hazard_data(request_data)
        ret_val = {
            'status': True,
            'message': "Successfully created new Hazard Data",
            'hazard_id': hazard_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to add Hazard Data: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/update/risk_assessment/umi/hazard_data", methods=["PATCH"])
def update_hazard_data():
    try:
        data = request.get_json()
        hazard_status = RiskAssessmentModel.modify_hazard_data(data)
        if hazard_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully updated Hazard Data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update Hazard Data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update Hazard Data: {e}"
        }
    return jsonify(ret_val)


@RISK_ASSESSMENT_BLUEPRINT.route("/delete/risk_assessment/umi/hazard_data", methods=["DELETE"])
def delete_hazard_data():
    try:
        data = request.get_json()
        hazard_status = RiskAssessmentModel.remove_hazard_data(data['id'])
        if hazard_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted Hazard Data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete Hazard Data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete Hazard Data: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/resource_and_capacities", methods=["GET"])
def get_all_resource_and_capacities():
    try:
        resource_and_capacities = RiskAssessmentModel.fetch_all_resource_and_capacities()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Resources and Capacities",
            'data': resource_and_capacities
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get Resources and Capacities: {err}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/add/risk_assessment/umi/resource_and_capacities", methods=["POST"])
def add_resource_and_capacities():
    try:
        data = request.get_json()
        request_data = {
            'resource_and_capacities': data['ResourceandCapacities'],
            'status': data['Status'],
            'owner': data['Owner'],
            'user_id': data['user_id']
        }
        hazard_id = RiskAssessmentModel.create_resource_and_capacities(request_data)
        ret_val = {
            'status': True,
            'message': "Successfully created new Resource and Capacity",
            'hazard_id': hazard_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to add Resource and Capacity: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/update/risk_assessment/umi/resource_and_capacities", methods=["PATCH"])
def update_resource_and_capacities():
    try:
        data = request.get_json()
        hazard_status = RiskAssessmentModel.modify_resource_and_capacities(data)
        if hazard_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully updated Resources and Capacities",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update Resources and Capacities. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update Resources and Capacities: {e}"
        }
    return jsonify(ret_val)


@RISK_ASSESSMENT_BLUEPRINT.route("/delete/risk_assessment/umi/resource_and_capacities", methods=["DELETE"])
def delete_resource_and_capacities():
    try:
        data = request.get_json()
        hazard_status = RiskAssessmentModel.remove_resource_and_capacities(data['id'])
        if hazard_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted Resource and Capacity",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete Resource and Capacity. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete Resource and Capacity: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/family_risk_profile", methods=["GET"])
def get_all_family_risk_profile():
    try:
        family_risk_profile = RiskAssessmentModel.fetch_all_family_risk_profile()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Family Risk Profile",
            'data': family_risk_profile
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get Family Risk Profile: {err}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/add/risk_assessment/umi/family_risk_profile", methods=["POST"])
def add_family_risk_profile():
    try:
        data = request.get_json()
        request_data = {
            'number_of_members': data['NumberofMembers'],
            'vulnerable_groups': data['VulnerableGroups'],
            'nature_of_vulnerability': data['NatureofVulnerability'],
            'user_id': data['user_id']
        }
        family_risk_id = RiskAssessmentModel.create_family_risk_profile(request_data)
        ret_val = {
            'status': True,
            'message': "Successfully created new family risk profile",
            'hazard_id': family_risk_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to add Family Risk Profile: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/update/risk_assessment/umi/family_risk_profile", methods=["PATCH"])
def update_family_risk_profile():
    try:
        data = request.get_json()
        family_risk_status = RiskAssessmentModel.modify_family_risk_profile(data)
        if family_risk_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully updated Family Risk Profile",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update Family Risk Profile. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update Family Risk Profile: {e}"
        }
    return jsonify(ret_val)


@RISK_ASSESSMENT_BLUEPRINT.route("/delete/risk_assessment/umi/family_risk_profile", methods=["DELETE"])
def delete_family_risk_profile():
    try:
        data = request.get_json()
        family_risk_status = RiskAssessmentModel.remove_family_risk_profile(data['id'])
        if family_risk_status == '0':
            ret_val = {
                'status': True,
                'message': "Successfully deleted Family Risk Profile",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete Family Risk Profile. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete Family Risk Profile: {e}"
        }
    return jsonify(ret_val)


@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/hazard_map", methods=["GET"])
def fetch_hazard_map():
    try:
        file_loc = APP_CONFIG['UMINGAN_DIR']

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

        response = {"status": True, "data": maps, "message": "Success loading map"}
    except ValueError as val_err:
        response = {"status": True, "data": [], "message": "No maps found"}
    except Exception as err:
        response = {"status": False, "data": maps, "message": "Failed loading map"}

    return jsonify(response)


@RISK_ASSESSMENT_BLUEPRINT.route("/upload/risk_assessment/umi/hazard_map", methods=["POST"])
def upload_hazard_map():
    try:
        file = request.files['file']
        directory = f"{APP_CONFIG['UMINGAN_DIR']}/MAPS/"
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

        return_data = {"status": True, "message": "Successfully uploaded map"}
    except Exception as err:
        # raise err
        return_data = { "status": False, "message": "Failed to upload map" }

    return jsonify(return_data)
