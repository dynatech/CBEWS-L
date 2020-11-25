from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
import json
import time
from datetime import datetime as dt
from datetime import timedelta as td
from src.model.v2.ground_data import GroundData
from src.model.v2.sites import Sites
from src.api.helpers import Helpers as h
from config import APP_CONFIG

SURFICIAL_ANALYSIS_BLUEPRINT = Blueprint(
    "surficial_analysis_blueprint", __name__)


@SURFICIAL_ANALYSIS_BLUEPRINT.route("/get/data_analysis/<site_code>/surficial/plot_data", methods=["GET"])
def fetch(site_code):
    surficial_plot = []
    site_id = APP_CONFIG["site_ids"][site_code]
    markers = GroundData.fetch_surficial_markers(site_id)  # Leave this for now
    ts_end = dt.today().strftime("%Y-%m-%d %H:%M:%S")
    ts_start = dt.today() - td(days=200)  # for data sampling
    ts_start = ts_start.strftime("%Y-%m-%d %H:%M:%S")

    for marker in markers:
        marker_id = marker["marker_id"]
        marker_name = marker["marker_name"]
        prelim_data = {
            'marker_id': marker_id,
            'marker_name': marker_name,
            'name': marker_name,
            'data': []
        }
        surficial_plot_data = GroundData.fetch_surficial_plot_data(
            marker_id, site_code, ts_start, ts_end)
        for row in surficial_plot_data:
            row["x"] = h.str_to_dt(row["x"]).timestamp()
            row["y"] = float(row["y"])
            prelim_data['data'].append(row)
        surficial_plot.append(prelim_data)

    ret_val = {
        'status': True,
        'surficial_plot': surficial_plot,
        'ts_start': ts_start,
        'ts_end': ts_end,
        'site_code': site_code
    }

    return jsonify(ret_val)


@SURFICIAL_ANALYSIS_BLUEPRINT.route("/get/data_analysis/<site_code>/surficial/plot_analysis", methods=["GET"])
def fetch_status_analysis(site_code):
    data = {
        "analysis": "No data available",
        "ts": h.dt_to_str(dt.now())
    }
    status = True
    message = ""
    site_id = Sites.get_site_details(
        filter_value=site_code, site_filter="site_code", return_col="site_id")
    latest_data = GroundData.fetch_latest_surficial_data(site_id)
    try:
        if latest_data:
            ts = latest_data[0]["ts"]
            op_trigger = GroundData.fetch_surficial_operational_trigger(
                site_id, ts)
            if op_trigger:
                alert_symbol = op_trigger[0]["alert_symbol"]
                alert_description = op_trigger[0]["alert_description"]
                latest_data_str = ""
                for item in latest_data[0]["data_list"]:
                    latest_data_str += f"{item[0]}->{item[1]}cm "
                
                ts_str = h.dt_to_str(ts)
                data = {
                    "analysis": f"As of {ts_str}, {alert_description}.",
                    "latest_data": f"{ts_str} | {latest_data_str}",
                    "ts": ts_str
                }
            message = "Successful"    
        else:
            message = "No available surficial data"

    except IndexError as ie:
        print(ie)
        message = "Problem with surficial index"
    except Exception as err:
        print(err)
        status = False
        message = "Error caught. See logs"
        raise

    return jsonify({
        "data": data,
        "message": message,
        "status": status
    })
