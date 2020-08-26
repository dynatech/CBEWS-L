import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from datetime import datetime
from calendar import monthrange
from werkzeug.datastructures import ImmutableMultiDict
from flask_cors import CORS, cross_origin
from connections import SOCKETIO

from fpdf import FPDF, HTMLMixin

from src.model.v2.mar.maintenance_logs import Maintenance as maintenance
from src.api.helpers import Helpers as helpers
from config import APP_CONFIG

from src.api.v2.file_management import file_management

MAINTENANCE_LOGS_BLUEPRINT = Blueprint(
    "maintenance_logs_blueprint", __name__)


@MAINTENANCE_LOGS_BLUEPRINT.route("/add/maintenance/mar/maintenance_logs", methods=["POST"])
@cross_origin()
def add():
    data = request.get_json()
    response = maintenance.create_maintenance_log(data)
    if response:
        return_value = {
            "status": True,
            "maintenance_log_id": response,
            "message": "New maintenance log data successfully added!"
        }
    else:
        return_value = {
            "status": False,
            "maintenance_log_id": None,
            "message": "Failed to add maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/maintenance/mar/maintenance_logs/", methods=["GET"])
@cross_origin()
def fetch():
    try:
        result = maintenance.fetch_all_maintenance_log()
        for x in result:
            x['maintenance_date'] = str(x['maintenance_date'])
            x['last_ts'] = str(x['last_ts'])
        response = {
            "status": True,
            "message": 'Successfully fetch maintenance logs.',
            "data": result
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching maintenance logs. Err: {err}'
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/day/maintenance/mar/maintenance_logs/<input_date>", methods=["GET"])
@cross_origin()
def fetch_day(input_date):
    try:
        input_date = helpers.str_to_dt(input_date)
        start = datetime(input_date.year, input_date.month, input_date.day, 0, 0, 0)
        end = datetime(input_date.year, input_date.month, input_date.day, 23, 59, 0)
        result = maintenance.fetch_filtered_maintenance_log(start, end)
        response = {
            "status": True,
            "data": result,
            "message": "Sucessfully fetched day maintenance logs."
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching day maintenance logs. Err: {err}'
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/fetch/month/maintenance/mar/maintenance_logs/<start>/<end>", methods=["GET"])
@cross_origin()
def fetch_month(start, end):
    try:
        result = maintenance.fetch_filtered_maintenance_log(start, end)
        response = {
            "status": True,
            "message": 'Successfully fetch month maintenance logs.',
            "data": result
        }
    except Exception as err:
        response = {
            "status": False,
            "message": f'Error fetching  month maintenance logs. Err: {err}'
        }
        raise

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/update/maintenance/mar/maintenance_logs", methods=["PATCH"])
@cross_origin()
def update():
    data = request.get_json()
    result = maintenance.update_maintenance_log(data)
    if result is not None:
        return_value = {
            "status": True,
            "message": "Maintenance logs data successfully updated!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to update maintenance logs data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/delete/maintenance/mar/maintenance_logs", methods=["DELETE"])
@cross_origin()
def remove():
    print("SHIIIIIIIIIIIIIT")
    data = request.get_json()
    helpers.var_checker("data", data)
    status = maintenance.delete_maintenance_log(data['id'])
    helpers.var_checker("status", status)
    if status == "0":
        return_value = {
            "status": True,
            "message": "Maintenance log data successfully deleted!"
        }
    else:
        return_value = {
            "status": False,
            "message": "Failed to delete maintenance log data. Please check your network connection."
        }
    return jsonify(return_value)


@MAINTENANCE_LOGS_BLUEPRINT.route("/maintenance/maintenance_logs/upload_log_attachment", methods=["POST"])
@cross_origin()
def upload_log_attachment():
    try:
        file = request.files['file']
        form_json = request.form.to_dict(flat=False)
        maintenance_log_id = form_json["maintenance_log_id"][0]
        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
        final_path = helpers.upload(file=file, file_path=file_path)

        response = {
            "status": True,
            "message": "Log attachment OKS!",
            "file_path": final_path
        }

    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Log attachment NOT oks!",
            "file_path": "ERROR"
        }

    return jsonify(response)


@MAINTENANCE_LOGS_BLUEPRINT.route("/maintenance/maintenance_logs/fetch_log_attachments/<maintenance_log_id>", methods=["GET"])
@cross_origin()
def fetch_log_attachments(maintenance_log_id):
    try:

        file_path = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOGS/{maintenance_log_id}/"
        files = helpers.fetch(file_path)

        response = {
            "status": True,
            "message": "Log attachment fetch OKS!",
            "data": files
        }

    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Log attachment fetch NOT oks!",
            "data": []
        }

    return jsonify(response)


class MyFPDF(FPDF, HTMLMixin):
    def header(self):
        # Logo
        self.image('C:\\Users\\John Louie\\codes\\CBEWS-L\\packages\\web\\src\\assets\\letter_header.png', 0, 10, 210)
        # self.image('/home/louie-cbews/CODES/CBEWS-L/packages/web/src/assets/letter_header.png', 0, 10, 210)
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Line break
        self.ln(20)
    def footer(self):
        self.image('C:\\Users\\John Louie\\codes\\CBEWS-L\\packages\\web\\src\\assets\\letter_footer.png', 0, 270, 210)
        # self.image('/home/louie-cbews/CODES/CBEWS-L/packages/web/src/assets/letter_footer.png', 0, 270, 210)
        self.set_y(-15)
    pass
    

@MAINTENANCE_LOGS_BLUEPRINT.route("/write_pdf", methods=["POST"])
def write_pdf():
    try:
        json = request.get_json()
        print("json", json)
        html2 = f"""{json["html"]}"""
        filename = json["filename"]

        pdf = MyFPDF()
        #First page
        pdf.add_page()
        pdf.write_html(html2)
        directory = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/"
        path = Path(f"{directory}{filename}")
        pdf.output(path, 'F')

        response = {
            "status": True,
            "message": "Success",
            "path": ""
        }
    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Failed",
            "path": None
        }
        raise

    return jsonify(response)


def write_pdf_internal(json):
    try:
        header = """<img width=530 src="/home/louie-cbews/CODES/CBEWS-L/packages/web/src/assets/letter_header.png" />"""
        html2 = f"""{json["html"]}"""
        filename = json["filename"]

        pdf = MyFPDF()
        #First page
        pdf.add_page()
        pdf.write_html(html2)
        directory = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/"
        path = Path(f"{directory}{filename}")
        pdf.output(path, 'F')

        response = {
            "status": True,
            "message": "Success",
            "path": path
        }
    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Failed",
            "path": None
        }
        raise

    return response


@MAINTENANCE_LOGS_BLUEPRINT.route("/send/maintenance_logs/report", methods=["POST"])
def send_maintenance_logs_pdf_via_email():
    """
    """
    try:
        json = request.get_json()
        date = json["date"]
        email_data = json["email_data"]
        recipients_list = email_data["recipient_list"]
        subject = email_data["subject"]
        email_body = email_data["email_body"]

        response = write_pdf_internal({
            "html": json["html"],
            "filename": "file_to_send.pdf"
        })
        helpers.var_checker("response1", response)
        file_location = response["path"]

        email_body = f"""<b>Maintenance report for:</b> {date}<br>{email_body}"""
        helpers.var_checker("email_body", email_body) 
        
        response = file_management.send_email(recipients_list, subject, email_body, file_location)
        helpers.var_checker("response send email", response)

        if response["status"] == True:
            response = {
                "status": True,
                "message": "Success",
                "data": []
            }
        else:
            raise Exception("test")
    
    except Exception as err:
        raise err
        response = {
            "status": False,
            "message": "Failed",
            "data": []
        }

    return jsonify(response)
