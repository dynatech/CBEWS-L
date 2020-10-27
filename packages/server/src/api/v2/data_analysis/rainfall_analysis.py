from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys
import json
from datetime import datetime as dt
from datetime import timedelta as td
import analysis_pycodes.analysis.rainfall.rainfall as rainfall_analysis
# from src.model.ground_data import GroundData
from src.api.helpers import Helpers as h

RAINFALL_ANALYSIS_BLUEPRINT = Blueprint("rainfall_analysis_blueprint", __name__)

@RAINFALL_ANALYSIS_BLUEPRINT.route("/get/data_analysis/<site_code>/rainfall/plot_data", methods=["GET"])
def fetch(site_code, internal=False):
    try:
        data_ts_end = dt.today().strftime("%Y-%m-%d %H:%M:%S")
        data_ts_start = dt.today() - td(days=7)

        plot_data = rainfall_analysis.main(site_code = site_code, end=data_ts_end, days=7)
        rain_data = json.loads(plot_data)

        rain_data[0]['ts_end'] = data_ts_end
        rain_data[0]['ts_start'] = data_ts_start.strftime("%Y-%m-%d %H:%M:%S")

        response = {
            "data": rain_data,
            "status": True,
            "message": "Success generating rain data"
        }
    except Exception as err:
        response = {
            "data": [],
            "status": False,
            "message": err
        }
    
    if internal:
        return response

    return jsonify(response)


@RAINFALL_ANALYSIS_BLUEPRINT.route("/get/data_analysis/<site_code>/rainfall/plot_analysis", methods=["GET"])
def fetch_status_analysis(site_code):
    response = fetch(site_code, internal=True)
    analysis_data = None
    if response["status"]:

        if response["data"]:
        # Analysis Starts Here
            plots = response["data"][0]["plot"]
            if plots:
                sorted_data_list = sorted(plots, key=lambda i: i["distance"])
                
                nearest_gauge = None
                latest_data = None
                for item in sorted_data_list:
                    if item["data"]:
                        latest_data = item["data"][len(item["data"]) - 1] 
                        if latest_data["24hr cumulative rainfall"] or latest_data["72hr cumulative rainfall"]:
                            nearest_gauge = item
                            break

                # Check if has data
                # n_g_data = nearest_gauge["data"]
                # latest_data = n_g_data[len(n_g_data) - 1]

                if nearest_gauge:
                    one_day_threshold = nearest_gauge["threshold_value"]
                    three_day_threshold = nearest_gauge["threshold_value"] / 2
                    
                    one_day_cumulative = latest_data["24hr cumulative rainfall"]
                    analysis_data["1_day"] = one_day_cumulative
                    one_d_percent = one_day_cumulative / one_day_threshold * 100 
                    analysis_data["1_day_percentage"] = one_d_percent

                    three_day_cumulative = latest_data["72hr cumulative rainfall"]
                    analysis_data["3_day"] = three_day_cumulative
                    three_d_percent = three_day_cumulative / three_day_threshold * 100 
                    analysis_data["3_day_percentage"] = three_d_percent

                    analysis = ""
                    if one_d_percent >= 100 or three_d_percent >= 100:
                        if one_d_percent >= 100:
                            analysis += f"1-day cumulative rainfall plot value ({one_day_cumulative} mm) is above threshold ({one_day_threshold} mm)"
                        if three_d_percent >= 100:
                            analysis += f"3-day cumulative rainfall plot value ({three_day_cumulative} mm) is above threshold ({three_day_threshold} mm)"
                    else:
                        analysis = "Both 1- and 3-day plots are below threshold levels."

                    # Set initial attributes
                    analysis_data = {
                        "analysis": analysis,
                        "data_source": nearest_gauge["data_source"],
                        "data_ts": latest_data["ts"],
                        "rain_gauge": nearest_gauge["gauge_name"],
                        "1_day_cumulative": one_day_cumulative,
                        "3_day_cumulative": three_day_cumulative,
                        "1_day_percent": one_d_percent,
                        "3_day_percent": three_d_percent,
                        "1_day_threshold": one_day_threshold,
                        "3_day_threshold": three_day_threshold
                    }

        response = {
            "data": analysis_data,
            "status": True,
            "message": "Success generating rain data"
        }        
    else:
        response = {
            "data": analysis_data,
            "status": False,
            "message": err
        }

    return jsonify(response)
