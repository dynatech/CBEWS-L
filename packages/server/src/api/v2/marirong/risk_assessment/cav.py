from flask import Blueprint, jsonify, request
from connections import SOCKETIO
from src.model.community_risk_assessment import CommunityRiskAssessment
from src.api.helpers import Helpers as h

CAPACITY_AND_VULNERABILITY_BLUEPRINT = Blueprint("capacity_and_vulnerability_blueprint", __name__)

@CAPACITY_AND_VULNERABILITY_BLUEPRINT.route("/add", methods=["POST"])
def add():
    data = request.get_json()
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


@CAPACITY_AND_VULNERABILITY_BLUEPRINT.route("/fetch/<site_id>/<cav_id>", methods=["GET"])
def fetch(site_id, cav_id="all"):
    result = CommunityRiskAssessment.fetch_cav(site_id, cav_id)
    data = []
    for row in result:
        row.update({
            "datetime": h.dt_to_str(row["date"]),
            "last_ts": h.dt_to_str(row["last_ts"])
        })
        data.append(row)
    return jsonify(data)


@CAPACITY_AND_VULNERABILITY_BLUEPRINT.route("/update", methods=["POST"])
def modify():
    data = request.get_json()
    result = CommunityRiskAssessment.update_cav(data)
    if result is not None:
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


@CAPACITY_AND_VULNERABILITY_BLUEPRINT.route("/remove", methods=["DELETE"])
def remove():
    (cav_id, site_id) = request.get_json().values()
    status = CommunityRiskAssessment.delete_cav(cav_id, site_id)
    if status is not None:
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
