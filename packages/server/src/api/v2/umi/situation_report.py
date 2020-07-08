
import time
import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from src.model.v2.umi.situation_report import SituationReportModel
import hashlib
from src.api.helpers import Helpers as h

from config import APP_CONFIG

SITUATION_REPORT_BLUEPRINT = Blueprint("situation_report_blueprint", __name__)

@SITUATION_REPORT_BLUEPRINT.route("/get/situation_report/umi/latest_report", methods=["GET"])
def get_latest_report_summary():
    try:
        summary = SituationReportModel.fetch_latest_situation_report()
        ret_val = {
            'status': True,
            'message': "Successfully loaded Latest Situation Report",
            'data': summary
        }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Situation Report."
        }
    return jsonify(ret_val)

@SITUATION_REPORT_BLUEPRINT.route("/download/situation_report/umi/latest_report", methods=["POST"])
def download_latest_report_summary():
    try:
        data = request.get_json()
        # summary = SituationReportModel.fetch_latest_field_survey()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Situation Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Situation Report."
        }
    return jsonify({
        'status': True
    })

@SITUATION_REPORT_BLUEPRINT.route("/email/situation_report/umi/latest_report", methods=["POST"])
def email_latest_report_summary():
    try:
        data = request.get_json()
        # summary = SituationReportModel.fetch_latest_field_survey()
        # ret_val = {
        #     'status': True,
        #     'message': "Successfully loaded Latest Situation Report",
        #     'data': summary
        # }
    except Exception as err:
        ret_val = {
            'status': False,
            'message': "Failed to get Latest Situation Report."
        }
    return jsonify({
        'status': True
    })

# @SITUATION_REPORT_BLUEPRINT.route("/get/field_survey/umi/field_survey_logs", methods=["GET"])
# def get_all_field_survey_logs():
#     try:
#         summary = FieldSurveyModel.fetch_field_survey_logs()
#         ret_val = {
#             'status': True,
#             'message': "Successfully loaded Latest Field Survey Logs",
#             'data': summary
#         }
#     except Exception as err:
#         ret_val = {
#             'status': False,
#             'message': "Failed to get Latest Field Survey Logs."
#         }
#     return jsonify(ret_val)

# @SITUATION_REPORT_BLUEPRINT.route("/add/field_survey/umi/field_survey_logs", methods=["POST"])
# def add_field_survey_logs():
#     try:
#         data = request.get_json()
#         summary = FieldSurveyModel.create_field_survey_log(data)
#         ret_val = {
#             'status': True,
#             'message': "Successfully added new Latest Field Survey Logs",
#             'data': summary
#         }
#     except Exception as err:
#         ret_val = {
#             'status': False,
#             'message': "Failed to add Field Survey Logs."
#         }
#     return jsonify(ret_val)

# @SITUATION_REPORT_BLUEPRINT.route("/update/field_survey/umi/field_survey_logs", methods=["PATCH"])
# def update_field_survey_logs():
#     try:
#         data = request.get_json()
#         summary_status = FieldSurveyModel.modify_field_survey_logs(data)

#         if summary_status == '0':
#             ret_val = {
#                 'status': True,
#                 'message': "Successfully updated field survey log",
#             }
#         else:
#             ret_val = {
#                 'status': False,
#                 'message': "Failed to update field survey log. Check your network connection",
#             }
#     except Exception as err:
#         ret_val = {
#             'status': False,
#             'message': f"Failed to updated Field Survey Logs. Err: {err}"
#         }
#     return jsonify(ret_val)

# @SITUATION_REPORT_BLUEPRINT.route("/delete/field_survey/umi/field_survey_logs", methods=["DELETE"])
# def delete_field_survey_logs():
#     try:
#         data = request.get_json()
#         summary_status = FieldSurveyModel.remove_field_survey_logs(data['id'])

#         if summary_status == '0':
#             ret_val = {
#                 'status': True,
#                 'message': "Successfully deleted field survey log",
#             }
#         else:
#             ret_val = {
#                 'status': False,
#                 'message': "Failed to delete field survey log. Check your network connection",
#             }
#     except Exception as err:
#         ret_val = {
#             'status': False,
#             'message': f"Failed to delete Field Survey Logs. Err: {err}"
#         }
#     return jsonify(ret_val)