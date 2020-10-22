from flask import Blueprint, jsonify, request
from src.model.v2.eq_data import Earthquake
from src.api.helpers import Helpers as H
from config import APP_CONFIG

EARTHQUAKE_BLUEPRINT = Blueprint("earthquake_blueprint", __name__)

@EARTHQUAKE_BLUEPRINT.route("/fetch/sensor_data/<site_code>/earthquake", methods=["GET"])
def fetch_latest_eq_events(site_code):
    eq_data = None
    try:
        site_id = APP_CONFIG["site_ids"][site_code]
        eq_data = Earthquake.get_latest_eq_events_by_site_id(site_id)
        response = {
            "status": True,
            "data": eq_data,
            "message": f"A problem has occured in fetching of eq events: {err}"
        }
        
    except Exception as err:
        print(err)
        response = {
            "status": False,
            "data": [],
            "message": f"A problem has occured in fetching of eq events: {err} | {eq_data}"
        }

    return jsonify(response)