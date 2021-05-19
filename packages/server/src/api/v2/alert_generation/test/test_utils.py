import os, platform
from packages.server.src.api.helpers import Helpers
from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys, json
from datetime import datetime as dt, timedelt


ALERTGEN_TEST_UTILS = Blueprint("public_alerts_blueprint", __name__)

@ALERTGEN_TEST_UTILS.route("/change_server_time", methods=["POST"])
def change_system_time():
    json_input = request.get_json()
    response = {
        "data": None,
        "status": 205,
        "ok": False
    }
    
    try:
        input = Helpers.str_to_dt(json_input["ts"])
        if platform.system() == "Windows":
            tempdate = json_input.strftime("%Y-%m-%d")
            temptime = json_input.strftime("%H:%M:%S")
            os.system(f"date '{tempdate}'")
            os.system(f"time '{temptime}'")
            response = {
                "data": None,
                "status": 200,
                "ok": True
            }
        else:
            os.system(f"timedatectl '{input}'")
            
    except Exception as err:
        raise(err)

    return jsonify(response)
