import os
import time
import glob
import smtplib
import ntpath
from pathlib import Path
from fpdf import FPDF, HTMLMixin
from flask import Blueprint, jsonify, request, send_file, send_from_directory, safe_join, abort, url_for, redirect
from src.api.helpers import Helpers as h

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

from config import APP_CONFIG

from utils.send_email import send_email
from utils.write_pdf import write_pdf_internal


FILE_MANAGEMENT_BLUEPRINT = Blueprint("file_management_blueprint", __name__)
    
@FILE_MANAGEMENT_BLUEPRINT.route("/download/mar/maintenance_log/<path:filename>", methods=["GET"])
def download_mar_maintenance_log(filename):
    try:
        directory = Path(f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/")
        response = send_from_directory(directory, filename=filename, as_attachment=True)
        response.cache_control.max_age = 5
        return response
    except FileNotFoundError:
        abort(404)


@FILE_MANAGEMENT_BLUEPRINT.route("/download/mar/incident_log/<string:filename>")
def download_mar_incident_log(filename):
    try:
        directory = Path(f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/INCIDENT_LOG/")
        response = send_from_directory(directory, filename=filename, as_attachment=True)
        response.cache_control.max_age = 5
        return response
    except FileNotFoundError:
        abort(404)


@FILE_MANAGEMENT_BLUEPRINT.route("/download/community_risk_assessment/mar/community_risk_assessment/<string:filename>")
def download_mar_community_risk_assessment(filename):
    try:
        directory = Path(f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/")
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


### UTIL ###
# def send_email(recipients_list, subject, message, file_location):
#     try:
#         # email = "dynaslopeswat@gmail.com"
#         # password = "dynaslopeswat"
#         email = "noreply.habhub@gmail.com"
#         password = "biomemsihabhub2021"
#         send_to_email = recipients_list

#         if file_location:
#             path, filename = ntpath.split(file_location)

#         msg = MIMEMultipart()
#         msg['From'] = email
#         msg['To'] = ", ".join(recipients_list)
#         msg['Subject'] = subject

#         msg.attach(MIMEText(message, 'html'))


#         if file_location:
#             with open(file_location, "rb") as attachment:
#                 part = MIMEBase("application", "octet-stream")
#                 part.set_payload(attachment.read())

#             encoders.encode_base64(part)

#         part.add_header(
#             "Content-Disposition",
#             f"attachment; filename= {filename}",
#         )
#         msg.attach(part)

#         server = smtplib.SMTP('smtp.gmail.com', 587)
#         server.starttls()
#         server.login(email, password)
#         text = msg.as_string()
#         try:
#             server.sendmail(email, recipients_list, text)
#         except Exception as e:
#             print(e)
#         finally:
#             server.quit()

#         response = {
#             "status": True,
#             "message": "Email sent successfully!"
#         }
#     except Exception as err:
#         print(err)
#         response = {
#             "status": False,
#             "message": "Failed sending email! Backend concerns."
#         }

#     return response


###################
# WRITE_PDF STUFF #
###################
# class MyFPDF(FPDF, HTMLMixin):
#     def header(self):
#         self.image(f"{APP_CONFIG['WEB_ASSETS_DIR']}/assets/letter_header.png", 0, 10, 210)
#         self.set_font('Arial', 'B', 15)
#         self.cell(80)
#         self.ln(20)
#     def footer(self):
#         self.image(f"{APP_CONFIG['WEB_ASSETS_DIR']}/assets/letter_footer.png", 0, 270, 210)
#         self.set_y(-15)
#     pass


# def write_pdf_internal(json):
#     try:
#         html = f"""{json["html"]}"""
#         filename = json["filename"]

#         pdf = MyFPDF()
#         #First page
#         pdf.add_page()
#         pdf.write_html(html)
#         directory = f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/"
#         path = Path(f"{directory}{filename}")
#         pdf.output(path, "F")

#         response = {
#             "status": True,
#             "message": "Success",
#             "path": path
#         }
#     except Exception as err:
#         print(err)
#         response = {
#             "status": False,
#             "message": "Failed",
#             "path": None
#         }
#         raise

#     return response


@FILE_MANAGEMENT_BLUEPRINT.route("/send/maintenance_logs/report", methods=["POST"])
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
            "filename": "file_to_send.pdf",
            "directory": f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/MAINTENANCE_LOG/"
        })
        file_location = response["path"]

        email_body = f"""<b>Maintenance report for:</b> {date}<br>{email_body}"""
        
        response = send_email(recipients_list, subject, email_body, file_location)
        
        if response["status"] == True:
            response = {
                "status": True,
                "message": "Success",
                "data": []
            }
        else:
            raise Exception("Failed to send email")
    
    except Exception as err:
        raise err
        response = {
            "status": False,
            "message": "Failed",
            "data": []
        }

    return jsonify(response)

