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


##############################
# MONITORING_MOMS (MOMS REPORTS/OBSERVATIONS)
##############################

@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/add/ground_data/moms", methods=["POST"])
def add():
    try:
        data = request.get_json()
        observance_ts = data["observance_ts"]
        instance_id = data["instance_id"]
        remarks = data["remarks"]
        reporter_id = data["reporter_id"]
        alert_level = data["alert_level"]
        site_id = data["site_id"]

        insert_result = GroundData.insert_moms_record(
            instance_id=instance_id, observance_ts=observance_ts, remarks=remarks,
            reporter_id=reporter_id, alert_level=alert_level
        )
        # TEST ERROR HANDLING
        if "status" in insert_result:
            return jsonify({
                "status": False,
                "code": 500,
                "message": f"Failed to insert moms record. Error: {insert_result['Message']}"
            })
        else:
            moms_id = insert_result

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
            insert_op_resp = AlertGen.insert_operational_trigger(
                site_id=site_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=observance_ts
            )
            if "status" in insert_op_resp:
                return jsonify({
                    "status": False,
                    "code": 500,
                    "message": f"Failed to insert operational trigger during moms insert. Error: {insert_op_resp['Message']}"
                })
            else:
                trigger_id = insert_op_resp

        # Else update especially ts in database:
        else:
            trigger_id = op_trig_data_dict["trigger_id"]
            result = AlertGen.update_operational_trigger(
                op_trig_id=trigger_id,
                trig_sym_id=trigger_sym_id,
                ts_updated=observance_ts
            )

        moms = {
            "status": True,
            "code": 200,
            "message": "Successfully added new Manifestation of Movements data.",
            "moms_id": moms_id,
            "trigger_id": trigger_id
        }
    except Exception as err:
        moms = {
            "status": False,
            "code": 500,
            "message": f"API Failure in process of adding moms data. Error: {err}"
        }
    return jsonify(moms)


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


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/update/ground_data/moms", methods=["POST"])
def update_monitoring_moms():
    try:
        data_list = request.get_json()
        
        moms_monitoring_update = GroundData.update_monitoring_moms(data_list)
        if "status" in moms_monitoring_update:
            return jsonify({
                "status": False,
                "message": f"Failure in updating moms obs. Error: {moms_monitoring_update['Message']}"
            })
        moms = {
            "status": True,
            "message": "Successfully updated Manifestation of Movements."
        }
    except Exception as err:
        moms = {
            "status": False,
            "message": "Failed to update monitoring_moms table (remarks) data."
        }
    return jsonify(moms)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/delete/ground_data/moms", methods=["delete"])
def delete_moms():
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


##############################
# MOMS INSTANCES (NAMES)
##############################

@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/add/ground_data/moms/instance", methods=["POST"])
def insert_moms_instance():
    try:
        data = request.get_json()
        result = GroundData.insert_moms_instance(data)
        H.var_checker("result", result)
        return_value = {
            "status": True,
            "instance_id": result,
            "message": "MOMS Instance successfully updated!"
        }
    except Exception as err:
        return_value = {
            "status": False,
            "message": f"Failed to update moms instance -> {err}"
        }
    return jsonify(return_value)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/instance/<feature_id>/<site_id>", methods=["GET"])
@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/instance/<site_id>", methods=["GET"])
def fetch_moms_instances(site_id, feature_id=None):
    try:
        name_container = []
        if feature_id:
            result = GroundData.fetch_moms_instance_by_feature_id(feature_id, None, site_id)
        else:
            moms_features = GroundData.fetch_moms_features()

            result = {}
            for row in moms_features:
                moms_instances_per_type = GroundData.fetch_moms_instances_by_feature_id_joined(row["feature_id"], site_id)
                
                result.update({int(row["feature_id"]): moms_instances_per_type})

        moms = {"status": True, "data": moms_instances}
    except Exception as err:
        moms = {
            "status": False,
            "message": f"Failed to fetch moms instances data. Error: {err}"
        }
    return jsonify(result)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/update/ground_data/moms/instance", methods=["POST"])
def update_moms_instance():
    try:
        data_list = request.get_json()
        GroundData.update_moms_instance(data_list)
        return_value = {
            "status": True,
            "message": "MOMS Instance successfully updated!"
        }
    except Exception as err:
        print(err)
        return_value = {
            "status": False,
            "message": f"Failed to update moms instance -> {err}"
        }
    return jsonify(return_value)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/delete/ground_data/moms/instance", methods=["delete"])
def delete_moms_instance():
    try:
        data = request.get_json()
        moms_delete = GroundData.delete_moms_instance(data['instance_id'])
        moms = {
            "status": True,
            "message": "Successfully deleted instance data."
        }
        if moms_delete["status"]:
            moms = {
                "status": False,
                "message": f"Failed to fetch moms instance data. Error: {moms_delete['message']}"
            }
    except Exception as err:
        print(err)
        moms = {
            "status": False,
            "message": f"Failed to fetch moms instance data. Error: {err}"
        }
    return jsonify(moms)


##############################
# MOMS FEATURES (TYPES)
##############################

@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/add/ground_data/moms/feature/types", methods=["POST"])
def insert_moms_feature():
    try:
        data = request.get_json()
        result = GroundData.insert_moms_feature(data)
        H.var_checker("result", result)
        return_value = {
            "status": True,
            "feature_id": result,
            "message": "MOMS feature successfully updated!"
        }
    except Exception as err:
        return_value = {
            "status": False,
            "message": f"Failed to update moms feature -> {err}"
        }
    return jsonify(return_value)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/feature/types", methods=["GET"])
@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/get/ground_data/moms/feature/types/<f_type>", methods=["GET"])
def fetch_moms_feature_types(f_type=None):
    try:
        if f_type:
            feature_types = GroundData.fetch_moms_features_by_type(f_type)
        else:
            feature_types = GroundData.fetch_moms_features()
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


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/update/ground_data/moms/feature/types", methods=["POST"])
def update_moms_feature():
    try:
        data_list = request.get_json()
        GroundData.update_moms_feature(data_list)
        return_value = {
            "status": True,
            "message": "MOMS Feature successfully updated!"
        }
    except Exception as err:
        print(err)
        return_value = {
            "status": False,
            "message": f"Failed to update moms feature -> {err}"
        }
    return jsonify(return_value)


@MANIFESTATION_OF_MOVEMENTS_BLUEPRINT.route("/delete/ground_data/moms/feature", methods=["delete"])
def delete_moms_feature():
    try:
        data = request.get_json()
        moms_delete = GroundData.delete_moms_feature(data['feature_id'])
        moms = {
            "status": True,
            "message": "Successfully deleted moms feature data."
        }
        if moms_delete["status"]:
            moms = {
                "status": False,
                "message": f"Failed to fetch moms feature data. Error: {moms_delete['message']}"
            }
    except KeyError:
        pass
    except Exception as err:
        print(err)
        moms = {
            "status": False,
            "message": f"Failed to fetch moms feature data. Error: {err}"
        }
    return jsonify(moms)
