import time
import os
import glob
from pathlib import Path
from flask import Blueprint, jsonify, request, send_file, send_from_directory, safe_join, abort, url_for, redirect
from src.api.helpers import Helpers as h

from config import APP_CONFIG

FILE_MANAGEMENT_BLUEPRINT = Blueprint("file_management_blueprint", __name__)

# @FILE_MANAGEMENT_BLUEPRINT.route("/download/file/", methods=["POST"])
# def download_file():
#     try:
#         json = request.get_json()
#         print(json)
#         response = send_from_directory(json["path"], filename=json["filename"], as_attachment=True)
#         print(response)

#         response = {
#             "status": True,
#             "message": "File download okay",
#             "data": response
#         }
#     except FileNotFoundError:
#         response = {
#             "status": False,
#             "message": "File missing",
#             "data": None
#         }
#         abort(404)

#     return jsonify(response)
    
@FILE_MANAGEMENT_BLUEPRINT.route("/download/mar/maintenance_log/<string:filename>")
def download_mar_community_risk_assessment(filename):
    try:
        directory = Path(f"{APP_CONFIG['MARIRONG_DIR']}/MAINTENANCE/MAINTENANCE_LOG/")
        return send_from_directory(directory, filename=filename, as_attachment=True )
    except FileNotFoundError:
        abort(404)


@FILE_MANAGEMENT_BLUEPRINT.route("/delete/community_risk_assessment/mar/community_risk_assessment", methods=["POST"])
def delete_mar_community_risk_assessment():
    try:
        json = request.get_json()
        print(f"{APP_CONFIG['CRA_PATH']}{json['filename']}")
        directory = APP_CONFIG['CRA_PATH']
        filename = json['filename']
        
        while os.path.exists(Path(directory) / filename):
            h.var_checker("Path(directory) / filename", Path(directory) / filename)
            # os.remove(f"'{directory}{filename}'")
            os.remove(Path(directory) / filename)
        return_data = {
            "message": "Deleted file!",
            "status": True,
            "data": None
        }
    except FileNotFoundError:
        abort(404)

    return jsonify(return_data)

@FILE_MANAGEMENT_BLUEPRINT.route("/display/mar/hazard_map")
def display_mar_hazmap():
    # directory = APP_CONFIG["MAPS_PATH"]
    # full_path = Path(directory) / filename
    # return redirect(url_for('static', filename=full_path), code=301)

    try:
        file_loc = APP_CONFIG['MARIRONG_DIR']

        basepath = f'{file_loc}/MAPS'
        map_list = glob.glob(basepath+"/*")
        latest_file = max(map_list, key=os.path.getctime)
        latest_file = latest_file.split("\\", 1)
        print()
        print(latest_file)
        print()
    except Exception as err:
        print(err)
        raise
    return send_from_directory(APP_CONFIG["CRA_PATH"], filename=latest_file[1], as_attachment=True )
