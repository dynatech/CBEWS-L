from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
from datetime import datetime as dt
from src.model.v2.ground_data import GroundData
from src.model.v2.alert_generation import AlertGeneration as AlertGen
from src.api.helpers import Helpers as H
from config import APP_CONFIG

MANIFESTATION_OF_MOVEMENTS_BLUEPRINT = Blueprint("manifestation_of_movements_blueprint", __name__)

def modify_ts_format(entry):
    entry.update({"observance_ts": H.dt_to_str(entry["observance_ts"])})
    return entry


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/<site_code>/moms", methods=["GET"])
def fetch_moms(site_code):
    try:
        site_id = APP_CONFIG["site_ids"][site_code]
        moms_list = GroundData.fetch_moms(site_id)
        moms_list = list(map(modify_ts_format, moms_list))
        moms = {
            "status": True,
            "data": moms_list
        }
    except Exception as err:
        moms = {
            "status": False,
            "message": f"Failed to fetch {site_code.upper()} moms data. Error: {err}"
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/add/ground_data/mar/moms", methods=["POST"])
def add():
    try:
        data = request.get_json()
        ts = data["ts"]
        feature_id = data["feature_id"]
        feature_name = data["feature_name"]
        reporter = data["reporter"]
        location = data["location"]
        remarks = data["remarks"]
        site_id = data["site_id"]
        user_id = data["user_id"]
        alert_level = data["alert_level"]

        instance = GroundData.fetch_feature_name(feature_id, feature_name, site_id)
        if len(instance) == 0:
            instance = GroundData.insert_moms_instance(site_id, feature_id, feature_name, 
                                                            location, reporter)
        else:
            instance = instance[0]["instance_id"]
        moms_id = GroundData.insert_moms_record(
            instance=instance, ts=ts, remarks=remarks,
            reporter_id=user_id, alert_level=alert_level
        )

        trigger_sym_id = AlertGen.get_operational_trigger_symbol(
                                    trigger_source='moms',
                                    alert_level=alert_level,
                                    return_col="trigger_sym_id")

        op_trig_data_dict = AlertGen.fetch_recent_operational_trigger(
            AlertGen,
            site_id=site_id,
            trig_sym_id=trigger_sym_id
        )

        # If nothing exists in database:
        if not op_trig_data_dict:
            trigger_id = AlertGen.insert_operational_trigger(
                site_id=site_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=ts
            )
        # Else update especially ts in database:
        else:
            trigger_id = op_trig_data_dict["trigger_id"]
            result = AlertGen.update_operational_trigger(
                op_trig_id=trigger_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=ts
            )
        if moms_id['status'] == True:
            moms = {
                "status": True,
                "message": "Successfully added new Manifestation of Movements data.",
                "moms_id": moms_id['data'],
                "trigger_id": trigger_id
            }
        else:
            moms = {
                "status": False,
                "message": f"Failed to add moms data."
            }
    except Exception as err:
        raise(err)
        moms = {
            "status": False,
            "message": f"Failed to fetch moms data. Error: {err}"
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/update/ground_data/moms", methods=["POST"])
def update():
    try:
        data = request.get_json()
        
        moms_id = data["moms_id"]
        remarks = data["remarks"]
        ts = data["ts"]
        feature_id = data["feature_id"]
        feature_name = data["feature_name"]
        reporter = data["reporter"]
        location = data["location"]
        site_id = data["site_id"]
        user_id = data["user_id"]
        alert_level = data["alert_level"]

        instance = GroundData.fetch_feature_name(feature_id, feature_name, site_id)
        if len(instance) == 0:
            instance = GroundData.insert_moms_instance(site_id, feature_id, feature_name, 
                                                            location, reporter)
        else:
            instance = instance[0]["instance_id"]
        moms_instance_update = GroundData.update_moms_instance(instance, location, reporter)
        if moms_instance_update['status'] == True:
            moms_monitoring_update = GroundData.update_monitoring_moms(moms_id, remarks)
            if moms_monitoring_update['status'] == True:
                moms = {
                    "status": True,
                    "message": "Successfully updated Manifestation of Movements."
                }
            else:
                moms = {
                    "status": False,
                    "message": "Failed to update monitoring_moms table (remarks) data."
                }
        else:
            moms = {
                "status": False,
                "message": "Failed to update moms instance table (location, reporter) data."
            }
    except Exception as err:
        raise(err)
        moms = {
            "status": False,
            "message": f"Failed to fetch moms data. Error: {err}"
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/delete/ground_data/moms", methods=["delete"])
def delete():
    try:
        moms = request.get_json()
        moms_delete = GroundData.delete_moms_observation(moms['moms_id'])
        if moms_delete['status'] == True:
            moms = {
                "status": True,
                "message": "Successfully deleted Manifestation of Movements data."
            }
        else:
            moms = {
                "status": False,
                "message": "Failed to delete moms data."
            }
    except Exception as err:
        raise(err)
        moms = {
            "status": False,
            "message": f"Failed to fetch moms data. Error: {err}"
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/feature/<feature_id>/<site_id>", methods=["GET"])
def fetch_feature(feature_id, site_id):
    try:
        name_container = []
        feature_names = GroundData.fetch_feature_name(feature_id, None, site_id)
        for name in feature_names:
            instance_id = name["instance_id"]
            feature_name = name["feature_name"]
            location = name["location"]
            reporter = name["reporter"]

            name_container.append({
                "instance_id": instance_id,
                "feature_name": feature_name,
                "location": location,
                "reporter": reporter
            })
        moms = {"status": True, "data": name_container}
    except Exception as err:
        moms = {
            "status": False,
            "message": f"Failed to fetch moms data. Error: {err}"
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/feature/types", methods=["GET"])
def fetch_moms_feature_types():
    try:
        feature_types = GroundData.fetch_feature_types()
        response = {
            "status": True,
            "data": feature_types,
            "message": "Successfully retrieved feature types"
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f"Failed to fetch moms data. Error: {err}"
        }
    return jsonify(response)
