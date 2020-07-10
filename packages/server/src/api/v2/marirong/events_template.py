from flask import Blueprint, jsonify, request
from flask_cors import CORS, cross_origin
from connections import SOCKETIO
from src.model.v2.mar.events_template import EventsTemplate
from config import APP_CONFIG

EVENTS_TEMPLATE_BLUEPRINT = Blueprint("events_template_blueprint", __name__)


@EVENTS_TEMPLATE_BLUEPRINT.route("/add/mar/events_template", methods=["POST"])
@cross_origin()
def add():
	data = request.get_json()
	status = EventsTemplate.create_events_template(data)
	if status is not None:
		return_value = {
			"status": True,
			"id": status,
			"message": "New event template data successfully added!"
		}
	else:
		return_value = {
			"status": False,
			"id": None,
			"message": "Failed to add event template data. Please check your network connection."
		}
	return jsonify(return_value)

@EVENTS_TEMPLATE_BLUEPRINT.route("/fetch/mar/events_template", methods=["GET"])
@cross_origin()
def fetch():
	try:
		result = EventsTemplate.fetch_events_templates()
		response = {
			"status": True,
			"data": result,
			"message": "Sucessfully fetched event templates."
		}

	except Exception as err:
		response = {
			"status": False,
			"data": [],
			"message": f"Failed to fetch event templates. Err: {err}"
		}
	return jsonify(response)

@EVENTS_TEMPLATE_BLUEPRINT.route("/update/mar/events_template", methods=["PATCH"])
@cross_origin()
def update():
	try:
		data = request.get_json()
		result = EventsTemplate.update_events_templates(data)
		if result == "0":
			response = {
				"status": True,
				"message": "Sucessfully updated event templates."
			}
		else:
			response = {
				"status": False,
				"message": "Faled to update event templates. Duplicate entry"
			}
	except Exception as err:
		response = {
			"status": False,
			"message": f"Failed to update event templates. Err: {err}"
		}

	return jsonify(response)

@EVENTS_TEMPLATE_BLUEPRINT.route("/delete/mar/events_template", methods=["DELETE"])
@cross_origin()
def delete():
	try:
		data = request.get_json()
		result = EventsTemplate.delete_events_templates(data)
		if result == "0":
			response = {
				"status": True,
				"message": "Sucessfully deleted event templates."
			}
		else:
			response = {
				"status": False,
				"message": "Faled to delete event templates."
			}
	except Exception as err:
		response = {
			"status": False,
			"message": f"Failed to delete event templates. Err: {err}"
		}

	return jsonify(response)