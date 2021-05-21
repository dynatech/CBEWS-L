import os, platform
from packages.server.src.api.helpers import Helpers
from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys, json
from datetime import datetime as dt, timedelt

ALERTGEN_TEST_ADD_BLUEPRINT = Blueprint("alertgen_test_add_blueprint", __name__)



@ALERTGEN_TEST_ADD_BLUEPRINT.route("/data_gen/add/rainfall", methods=["POST"])
def add_rainfall():
    json_input = request.get_json()

    RAIN_IDS_LOOKUP = { 29: 29, 50: 50 }

    response = {
        "data": None,
        "status": 205,
        "ok": False
    }

    # Insert Rainfall alert entry if alert level 1
    if json_input["alert_level"]


    # Check for existing rainfall optrigger entry

    try:
        print()
            
    except Exception as err:
        raise(err)

    return jsonify(response)

@ALERTGEN_TEST_ADD_BLUEPRINT.route("/data_gen/add/surficial", methods=["POST"])
def add_surficial():
    json_input = request.get_json()
    response = {
        "data": None,
        "status": 205,
        "ok": False
    }
    
    try:
        print()
            
    except Exception as err:
        raise(err)

    return jsonify(response)

@ALERTGEN_TEST_ADD_BLUEPRINT.route("/data_gen/add/subsurface", methods=["POST"])
def add_subsurface():
    json_input = request.get_json()
    response = {
        "data": None,
        "status": 205,
        "ok": False
    }
    
    try:
        print()
            
    except Exception as err:
        raise(err)

    return jsonify(response)
