import smtplib
import ntpath

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

"""
Send PDF reports as email utility
"""

def send_email(recipients_list, subject, message, file_location):
    try:
        # email = "dynaslopeswat@gmail.com"
        # password = "dynaslopeswat"
        email = "noreply.habhub@gmail.com"
        password = "biomemsihabhub2021"
        send_to_email = recipients_list

        if file_location:
            path, filename = ntpath.split(file_location)

        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = ", ".join(recipients_list)
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'html'))


        if file_location:
            with open(file_location, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())

            encoders.encode_base64(part)

        part.add_header(
            "Content-Disposition",
            f"attachment; filename= {filename}",
        )
        msg.attach(part)

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email, password)
        text = msg.as_string()
        try:
            server.sendmail(email, recipients_list, text)
        except Exception as e:
            print(e)
        finally:
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

    return response