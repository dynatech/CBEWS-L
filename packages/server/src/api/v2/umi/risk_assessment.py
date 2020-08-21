
import time
import os
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
            'message': "Failed to get risk assessment summary."
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
        h.var_checker("data", data)
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
            'message': "Successfully created new summary",
            'summary_id': summary_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert summary: {e}"
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
                'message': "Successfully updated summary",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update summary. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert summary: {e}"
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
                'message': "Successfully deleted summary",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete summary. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to insert summary: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/hazard_data", methods=["GET"])
def get_all_hazard_data():
    try:
        hazard_data = RiskAssessmentModel.fetch_all_hazard_data()
        ret_val = {
            'status': True,
            'message': "Successfully loaded risk assessment hazard data",
            'data': hazard_data
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get risk assessment hazard data. Error: {err}"
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
            'message': "Successfully created new hazard data",
            'hazard_id': hazard_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to add hazard data: {e}"
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
                'message': "Successfully updated hazard data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update hazard data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update hazard_Data: {e}"
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
                'message': "Successfully deleted hazard data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete hazard data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete hazard data: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/resource_and_capacities", methods=["GET"])
def get_all_resource_and_capacities():
    try:
        resource_and_capacities = RiskAssessmentModel.fetch_all_resource_and_capacities()
        ret_val = {
            'status': True,
            'message': "Successfully loaded risk assessment hazard data",
            'data': resource_and_capacities
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get risk assessment hazard data. Error: {err}"
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
            'message': "Successfully created new hazard data",
            'hazard_id': hazard_id
        }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to add hazard data: {e}"
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
                'message': "Successfully updated hazard data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update hazard data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update resource and capacities: {e}"
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
                'message': "Successfully deleted hazard data",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete hazard data. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete hazard data: {e}"
        }
    return jsonify(ret_val)

@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/family_risk_profile", methods=["GET"])
def get_all_family_risk_profile():
    try:
        family_risk_profile = RiskAssessmentModel.fetch_all_family_risk_profile()
        ret_val = {
            'status': True,
            'message': "Successfully loaded risk assessment family risk profile",
            'data': family_risk_profile
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': f"Failed to get risk assessment family risk profile. Error: {err}"
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
            'message': f"Failed to add family risk profile: {e}"
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
                'message': "Successfully updated family risk profile",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to update family risk profile. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to update resource and capacities: {e}"
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
                'message': "Successfully deleted family risk profile",
            }
        else:
            ret_val = {
                'status': False,
                'message': "Failed to delete family risk profile. Check your network connection",
            }
    except Exception as e:
        ret_val = {
            'status': False,
            'message': f"Failed to delete family risk profile: {e}"
        }
    return jsonify(ret_val)




@RISK_ASSESSMENT_BLUEPRINT.route("/get/risk_assessment/umi/hazard_map", methods=["GET"])
def fetch_hazard_map():
    file_loc = APP_CONFIG['UMINGAN_DIR']

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

        return_data = { "status": True }
    except Exception as err:
        # raise err
        return_data = { "status": False }

    return jsonify(return_data)
