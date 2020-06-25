
import time
import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from src.model.v2.umi.field_survey import FieldSurveyModel
import hashlib
from src.api.helpers import Helpers as h

from config import APP_CONFIG

FIELD_SURVEY_BLUEPRINT = Blueprint("field_survey_blueprint", __name__)

@FIELD_SURVEY_BLUEPRINT.route("/get/field_survey/umi/latest_report", methods=["GET"])
def get_latest_report_summary():
    try:
        summary = FieldSurveyModel.fetch_latest_field_survey()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Latest Field Survey Report",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify(ret_val)

@FIELD_SURVEY_BLUEPRINT.route("/download/field_survey/umi/latest_report", methods=["POST"])
def download_latest_report_summary():
    try:
        data = request.get_json()
        print(data)
        # summary = FieldSurveyModel.fetch_latest_field_survey()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Field Survey Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify({
        'status': True
    })

@FIELD_SURVEY_BLUEPRINT.route("/email/field_survey/umi/latest_report", methods=["POST"])
def email_latest_report_summary():
    try:
        data = request.get_json()
        print(data)
        # summary = FieldSurveyModel.fetch_latest_field_survey()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Field Survey Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Field Survey Report."
        }
    return jsonify({
        'status': True
    })
