
from flask import Blueprint, jsonify, request
from src.model.v2.users import Users
import hashlib

USER_MANAGEMENT_BLUEPRINT = Blueprint("user_management_blueprint", __name__)

@USER_MANAGEMENT_BLUEPRINT.route("/auth/signin", methods=["POST"])
def signin():
    credentials = request.get_json()
    username, password = credentials.values()
    account_details = Users.fetch_account(username)
    if len(account_details) != 0:
        acc_details = account_details[0]
        v_password = acc_details["password"]
        salt = acc_details["salt"]

        password_hashed = str(hashlib.sha512(str(password+salt).encode("utf-8")).hexdigest())

        if v_password == password_hashed:
            status = {
                "status": True,
                "message": "Login Successfull!",
                "user_data": acc_details
            }
        else:
            status = {
                "status": False,
                "message": "Invalid password, please try again."
            }
    else:
        status = {
            "status": False,
            "message": "Username / Password does not match any records."
        }
    return jsonify(status)

@USER_MANAGEMENT_BLUEPRINT.route("/auth/signout", methods=["GET"])
def signout():
    return jsonify({"status": True})

@USER_MANAGEMENT_BLUEPRINT.route("/auth/signup", methods=["POST"])
def signup():
    credentials = request.get_json()
    is_existing = Users.account_exists(credentials['username'])[0]['COUNT(*)']
    if is_existing == 0:
        status = Users.create_user_account(credentials)
    else:
        status = {
            "status": False,
            "message": f"Duplicate CBEWS-L Account. Please login your {credentials['username']} account."
        }
    return jsonify(status)

@USER_MANAGEMENT_BLUEPRINT.route("/auth/forgot_password", methods=["GET"])
def forgot_password():
    return jsonify({"status": True})