
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