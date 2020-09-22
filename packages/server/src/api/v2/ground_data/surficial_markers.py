from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
from datetime import datetime as dt
from src.model.v2.ground_data import GroundData
from config import APP_CONFIG
from src.api.helpers import Helpers as h

SURFICIAL_MARKERS_BLUEPRINT = Blueprint("surficial_markers_blueprint", __name__)


@SURFICIAL_MARKERS_BLUEPRINT.route("/get/ground_data/<site_code>/surficial_markers", methods=["GET"])
def fetch(site_code):
    try:
        site_list = APP_CONFIG["site_ids"]
        site_id = site_list[site_code]
        data_list = []
        ts_list = []
        
        surficial_data = GroundData.fetch_surficial_data(site_id)
        surficial_markers = GroundData.fetch_surficial_markers(site_id)
        for row in surficial_data:
            (ts, measurement, marker, observer, weather) = row.values()
            ts = str(ts)

            if ts not in ts_list:
                data_list.append({
                    ts: {
                        "ts": ts,
                        "weather": weather,
                        "observer": observer,
                        marker: measurement
                    }
                })
                ts_list.append(ts)
            else:
                ts_index = ts_list.index(ts)
                data_list[ts_index][ts][marker] = measurement

        response = {
            "data": data_list,
            "markers": surficial_markers,
            "status": True,
            "message": "Fetch success!"
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f"Failed to fetch surficial data. Error: {err}"
        }
    return jsonify(response)

@SURFICIAL_MARKERS_BLUEPRINT.route("/modify/ground_data/surficial_markers", methods=["PATCH"])
def modify():
    try:
        marker_values_update = True
        data = request.get_json()
        current_ts = str(dt.today())
        data['new_ts'] = str(dt.strptime(data['new_ts'], '%Y-%m-%d %H:%M:%S'))
        data['ref_ts'] = str(dt.strptime(data['ref_ts'], '%Y-%m-%d %H:%M:%S'))

        if data['new_ts'] > current_ts:
            surficial = {
                "status": False,
                "message": "Failed to modify surficial data. Data timestamp out of bounce."
            }
        else:
            mo_ret_val = GroundData.fetch_surficial_mo_id(data['ref_ts'], data['site_id'])
            
            temp_array = GroundData.fetch_marker_ids_v_moid(mo_ret_val[0]["mo_id"])
            temp_stack = []
            for item in temp_array:
                temp_stack.append(list(item.values()))

            marker_ids = dict(map(reversed, temp_stack))
            for x in data['marker_values']:
                status = GroundData.update_surficial_marker_values(mo_ret_val[0]["mo_id"], marker_ids[x], data['marker_values'][x])
                if status == None:
                    marker_values_update = False
            if marker_values_update == True:
                status = GroundData.update_surficial_marker_observation(mo_ret_val[0]["mo_id"], 
                        data['new_ts'], data['weather'], data['observer'], data['site_id'])
                if status != None:
                    surficial = {
                        "status": True,
                        "message": "Successfull modification for surficial data."
                    }
            else:
                surficial = {
                    "status": False,
                    "message": f"Failed to modify surficial data. Error: updating marker values"
                }
    except Exception as err:
        surficial = {
            "status": False,
            "message": f"Failed to modify surficial data. Error: {err}"
        }
    return jsonify(surficial)


@SURFICIAL_MARKERS_BLUEPRINT.route("/add/ground_data/surficial_markers", methods=["POST"])
def add():
    try:
        data = request.get_json()
        h.var_checker("data", data)
        mo_status = GroundData.insert_marker_observation(data)
        missing_marker = []
        if mo_status['status'] == True:
            if mo_status['mo_id'] is not None:
                marker_ids = GroundData.fetch_surficial_markers(data['site_id'])
                for id in marker_ids:
                    h.var_checker("id", id)
                    marker_status = GroundData.insert_marker_values(id["marker_id"], 
                            data['marker_value'][id["marker_name"]], mo_status['mo_id'])
                    if (marker_status['data'] == False):
                        missing_marker.append(id["marker_id"])
                if len(missing_marker) != 0:
                    message = f'Missing or Invalid marker value for: {id["marker_id"]}'
                else:
                    message = "Successfully added surficial data."
                surficial = {
                    "status": True,
                    "message": message
                }
            else:
                surficial = {
                    "status": False,
                    "message": f"Failed to modify surficial data. Error: Duplicate entry for timestamp {data['ts']}"
                }
        else:
            surficial = {
                "status": False,
                "message": f"Failed to modify surficial data. Error: {mo_status['message']}"
            }
    except Exception as err:
        surficial = {
            "status": False,
            "message": f"Failed to modify surficial data. Error: {err}"
        }
    finally:
        return jsonify(surficial)

@SURFICIAL_MARKERS_BLUEPRINT.route("/remove/ground_data/surficial_markers", methods=["POST"])
def remove():
    try:
        data = request.get_json()
        mo_id = GroundData.delete_marker_observation(data)
        if mo_id[status]:
            del_status = GroundData.delete_marker_values(mo_id)
            surficial = del_status
        else:
            surficial = {
                "status": False,
                "message": f"Failed to modify surficial data. Error: {err}"
            }
    except Exception as err:
        raise(err)
        surficial = {
            "status": False,
            "message": f"Failed to modify surficial data. Error: {err}"
        }
    finally:
        return jsonify(surficial)