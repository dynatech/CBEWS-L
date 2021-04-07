from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
from datetime import datetime as dt
from src.model.v2.ground_data import GroundData
from src.model.v2.alert_generation import AlertGeneration as AlertGen
from src.api.helpers import Helpers as H
from config import APP_CONFIG


ON_DEMAND_BLUEPRINT = Blueprint("on_demand_blueprint", __name__)


@ON_DEMAND_BLUEPRINT.route("/fetch/ground_data/<site_code>/on_demand", methods=["GET"])
def fetch(site_code):
    try:
        site_dict = APP_CONFIG["site_ids"]
        site_id = site_dict[site_code]
        od_list = GroundData.get_latest_od_events(site_id=site_id)
        od = {
            "status": True,
            "data": od_list,
            "message": "Successfully fetched on demand data.",
        }
    except Exception as err:
        od = {
            "status": False,
            "data": [],
            "message": f"Failed to fetch od data. Error: {err}"
        }
    return jsonify(od)


@ON_DEMAND_BLUEPRINT.route("/add/ground_data/on_demand", methods=["POST"])
def add():
    try:
        json = request.get_json()
        alert_level = json["alert_level"]
        reason = json["reason"]
        reporter = json["reporter"]
        site_id = json["site_id"]
        ts = json["ts"]
        
        result = GroundData.insert_on_demand_alert(ts, site_id, reason, reporter, alert_level)

        if result['status']:
            od_data_return = {
                "status": True,
                "message": "Successfully added new on demand data.",
                "data": result['data']
            }
        else:
            od_data_return = {
                "status": False,
                "message": f"Failed to add OD data."
            }
    except Exception as err:
        raise(err)
        od_data_return = {
            "status": False,
            "message": f"Failed to add OD data."
        }
    return jsonify(od_data_return)


@ON_DEMAND_BLUEPRINT.route("/raise/ground_data/on_demand", methods=["POST"])
def raise_on_demand():
    try:
        print(request.get_json(), "\n")
        (site_id, timestamp) = request.get_json().values()

        trigger_sym_id = AlertGen.get_operational_trigger_symbol(
                                    trigger_source='on demand',
                                    alert_level=1,          # alert_level for on-demand default = 1
                                    return_col="trigger_sym_id")

        print("trigger_sym_id:", trigger_sym_id, "\n")

        op_trig_data_dict = AlertGen.fetch_recent_operational_trigger(
            AlertGen,
            site_id=site_id,
            trig_sym_id=trigger_sym_id
        )

        print("op_trig_data_dict:", op_trig_data_dict, "\n")

        # If nothing exists in database:
        if not op_trig_data_dict:
            result = AlertGen.insert_operational_trigger(
                site_id=site_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=timestamp
            )
        # Else update especially ts in database:
        else:
            trigger_id = op_trig_data_dict["trigger_id"]
            result = AlertGen.update_operational_trigger(
                op_trig_id=trigger_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=timestamp
            )

        od_data_return = {
            "status": True,
            "message": "Successfully raised on-demand data."
        }
    except Exception as err:
        raise(err)
        od_data_return = {
            "status": False,
            "message": f"Failed to raise on-demand data."
        }

    return jsonify(od_data_return)
