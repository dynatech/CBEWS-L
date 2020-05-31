
from flask import Blueprint, jsonify, request
from src.model.v2.umi.risk_assessment import RiskAssessmentModel
import hashlib

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
        print(summary_status)
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