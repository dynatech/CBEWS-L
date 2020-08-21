import smtplib
import os
from pathlib import Path
from flask import Blueprint, jsonify, request
from datetime import datetime
from calendar import monthrange
from werkzeug.datastructures import ImmutableMultiDict
from flask_cors import CORS, cross_origin
from connections import SOCKETIO

from fpdf import FPDF, HTMLMixin

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

from src.model.v2.mar.maintenance_logs import Maintenance as maintenance
from src.api.helpers import Helpers as helpers
from config import APP_CONFIG

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


@MAINTENANCE_LOGS_BLUEPRINT.route("/send/email/maintenance_logs", methods=["GET", "POST"])
def send_maintenance_log_report_via_email():
    data = request.form
    try:
        date = data["date"]

        email = "dynaslopeswat@gmail.com"
        password = "dynaslopeswat"
        send_to_email = data["email"]
        subject = "Field Survey : " + str(date)

        message = "<b>Maintenance report for:</b> " + date + "<br>"
        file_location = 'test.pdf'

        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = send_to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email, password)
        text = msg.as_string()
        server.sendmail(email, send_to_email, text)
        server.quit()

        response = {
            "status": True,
            "message": "Email sent successfully!"
        }
    except Exception as err:
        print(err)
        response = {
            "status": False,
            "message": "Failed sending email! Backend concerns."
        }

    return jsonify(response)

class MyFPDF(FPDF, HTMLMixin):
    pass

@MAINTENANCE_LOGS_BLUEPRINT.route("/write_pdf", methods=["POST"])
def write_pdf(): 
    try:
        html = """
        <H1 align="center">html2fpdf</H1>
        <h2>Basic usage</h2>
        <p>You can now easily print text mixing different
        styles : <B>bold</B>, <I>italic</I>, <U>underlined</U>, or
        <B><I><U>all at once</U></I></B>!<BR>You can also insert links
        on text, such as <A HREF="http://www.fpdf.org">www.fpdf.org</A>,
        or on an image: click on the logo.<br>
        <center>
        </center>
        <h3>Sample List</h3>
        <ul><li>option 1</li>
        <ol><li>option 2</li></ol>
        <li>option 3</li></ul>

        <table border="0" align="center" width="50%">
        <thead><tr><th width="30%">Header 1</th><th width="70%">header 2</th></tr></thead>
        <tbody>
        <tr><td>cell 1</td><td>cell 2</td></tr>
        <tr><td>cell 2</td><td>cell 3</td></tr>
        </tbody>
        </table>
        """
        html = request.get_json()["html"]

        pdf = MyFPDF()
        #First page
        pdf.add_page()
        pdf.write_html(html)
        path = Path('C:/Users/John Louie/codes/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG/temp/html.pdf')
        pdf.output(path, 'F')

        helpers.var_checker("pdf", pdf)

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
