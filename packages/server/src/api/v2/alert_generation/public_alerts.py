from flask import Blueprint, jsonify, request
from connections import SOCKETIO
import sys, json
from datetime import datetime as dt, timedelta
from src.model.v2.alert_generation import AlertGeneration
from src.model.v2.public_alert_table import PublicAlertTable as PAT
from src.model.v2.users import Users
from src.model.v2.dynamic_variables import DynamicVariables as dv
from src.api.helpers import Helpers as h
from src.api.v2.alert_generation import candidate_alerts_generator

from src.utils.send_email import send_email
from src.utils.write_pdf import write_pdf_internal

from config import APP_CONFIG

PUBLIC_ALERTS_BLUEPRINT = Blueprint("public_alerts_blueprint", __name__)


########################
# START OF MAR UI APIs #
########################

def get_haphazard_rain_data_source(tech_info):
    start = 0
    end = tech_info.find(":") - 1
    rain_data_source = tech_info[start:end]
    return rain_data_source

def get_haphazard_moms_data_source(tech_info):
    start = tech_info.find(":") + 2
    end = tech_info.find("found") - 1
    moms_data_source = tech_info[start:end]
    return moms_data_source

def get_haphazard_sensor_data_source(tech_info):
    start = 0
    end = tech_info.find(")")
    sensor_data_source = tech_info[start:end]
    return sensor_data_source

def prepare_triggers(row):
    trigger_source = row["trigger_source"]
    info = ""

    print("PREPARE TRIGGERS ROW: ", row)

    data_source = "UnDefined"
    if trigger_source == "rainfall":
        info = row["info"]
        data_source = get_haphazard_rain_data_source(row["info"])
    elif trigger_source == "moms":
        try:
            info = row["info"]["m3"]
        except KeyError:
            info = row["info"]["m2"]
        data_source = get_haphazard_moms_data_source(info)
    elif trigger_source == "subsurface":
        try:
            info = row["info"]["L3"]
        except KeyError:
            info = row["info"]["L2"]
        data_source = get_haphazard_sensor_data_source(info)
    elif trigger_source == "surficial":
        try:
            info = row["info"]["l3"]
        except KeyError:
            info = row["info"]["l2"]
        data_source = "dummy"
    elif trigger_source == "on demand":
        info = row["info"]
        data_source = "Requested by authorities"
    elif trigger_source == "on demand":
        info = row["info"]
        data_source = "Requested by authorities"

    row.update({
        "info": info,
        "date_time": row["timestamp"],
        "trigger": trigger_source.capitalize(),
        "data_source": data_source,
        "description": info,
        "trigger_id": row["trigger_id"]
    })

    try:
        row.update({ "is_invalid": row["is_invalid"]})
    except KeyError:
        pass

    return row


@PUBLIC_ALERTS_BLUEPRINT.route("/get/alert_gen/mar/alert_validation_data", methods=["GET"])
def get_mar_alert_validation_data():
    response = { "data": None, "status": False }
    try:
        json_data = json.loads(candidate_alerts_generator.main(to_update_pub_alerts=True))
        mar_data = next(filter(lambda x: x["site_code"] == "mar", json_data), None)
        new_rel_trigs = []
        as_of_ts = h.dt_to_str(h.round_down_data_ts(dt.now()))
        if mar_data:
            release_triggers = mar_data["release_triggers"]
            new_rel_trigs = list(map(prepare_triggers, release_triggers))

            mar_data.update({
                "release_triggers": new_rel_trigs, 
                "as_of_ts": as_of_ts,
                "release_time": h.dt_to_str(dt.now()),
                "comments": "No Comment",
                "bulletin_number": PAT.fetch_site_bulletin_number(PAT, site_id=29)
            })

            response = {
                "data": mar_data,
                "status": True
            }
        else:
            response = {
                "data": {
                    "as_of_ts": as_of_ts,
                    "public_alert_level": 0,
                    "status": "no_alert"
                },
                "message": "Latest validation data retrieved",
                "status": True
            }
            
    except Exception as err:
        raise(err)

    return jsonify(response)


@PUBLIC_ALERTS_BLUEPRINT.route("/get/alert_gen/umi/alert_validation_data", methods=["GET"])
def get_umi_alert_validation_data():
    response = { "data": None, "status": False }
    try:
        json_data = json.loads(candidate_alerts_generator.main(to_update_pub_alerts=True))
        umi_data = next(filter(lambda x: x["site_code"] == "umi", json_data), None)
        new_rel_trigs = []
        as_of_ts = h.dt_to_str(h.round_down_data_ts(dt.now()))
        if umi_data:
            release_triggers = umi_data["release_triggers"]

            print("PREPARE TRIGGERS: \n", prepare_triggers)
            print("UMI DATA RELEASE TRIGGERS: ", release_triggers)

            new_rel_trigs = list(map(prepare_triggers, release_triggers))

            umi_data.update({
                "release_triggers": new_rel_trigs, 
                "as_of_ts": as_of_ts,
                "release_time": h.dt_to_str(dt.now()),
                "comments": "No Comment",
                "bulletin_number": PAT.fetch_site_bulletin_number(PAT, site_id=50)
            })

            response = {
                "data": umi_data,
                "status": 200,
                "ok": True
            }
        else:
            response = {
                "data": {
                    "as_of_ts": as_of_ts,
                    "public_alert_level": 0,
                    "status": "no_alert"
                },
                "message": "Latest validation data retrieved",
                "status": 200,
                "ok": True
            }
    
    except Exception as err:
        raise(err)

    return jsonify(response)


@PUBLIC_ALERTS_BLUEPRINT.route("/send/mar/latest_current_alert/report", methods=["POST"])
def send_mar_latest_current_alert_pdf_via_email():
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
            "filename": "MAR_latest_alert_report.pdf",
            "directory": f"{APP_CONFIG['MARIRONG_DIR']}/DOCUMENTS/LATEST_CURRENT_ALERT/"
        })
        file_location = response["path"]

        email_body = f"""<b>Marirong Latest Current Report</b> {date}<br>{email_body}"""
        
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

@PUBLIC_ALERTS_BLUEPRINT.route("/send/umi/latest_current_alert/report", methods=["POST"])
def send_umi_latest_current_alert_pdf_via_email():
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
            "filename": "UMI_latest_alert_report.pdf",
            "directory": f"{APP_CONFIG['UMINGAN_DIR']}/DOCUMENTS/LATEST_CURRENT_ALERT/"
        })
        file_location = response["path"]

        email_body = f"""<b>Umingan Latest Current Report</b> {date}<br>{email_body}"""
        
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


######################
# END OF MAR UI APIs #
######################


@PUBLIC_ALERTS_BLUEPRINT.route("/validate_trigger/public_alerts", methods=["POST"])
def validate_trigger():
    """
    """
    try:
        AG = AlertGeneration
        json_input = request.get_json()
        trigger_id = json_input["trigger_id"]
        alert_status = json_input["alert_status"]
        remarks = json_input["remarks"]
        user_id = json_input["user_id"]

        # FIND IF alert_status row exists for trigger id
        alert_status_row = AG.fetch_alert_status(AG, trigger_id)
        now_ts_str = h.dt_to_str(dt.now())

        if alert_status_row:
            # If exists, update
            result = AG.update_alert_status(AG,
                update_dict={
                    "alert_status": alert_status,
                    "remarks": remarks,
                    "ts_set": now_ts_str,
                    "ts_ack": now_ts_str,
                    "user_id": user_id
                },
                where_dict={
                    "trigger_id": trigger_id
                }
            )
        else:
            # If not, insert
            alert_id = AG.insert_alert_status(
                self=AG,
                trigger_id=trigger_id,
                ts_last_retrigger=json_input["ts_last_retrigger"],
                ts_set=now_ts_str,
                ts_ack=now_ts_str,
                alert_status=alert_status,
                remarks=remarks,
                user_id=user_id
            )
            result = alert_id
        
        response = {
            "data": result,
            "status": True,
            "message": "Trigger successfully validated."
        }
    except Exception as err:
        # raise(err)
        response = {
            "data": None,
            "status": False,
            "message": "Error in validating trigger"
        }

    return jsonify(response)


def get_trigger_type_details(trigger_type):
    """
    Util Function
    """
    print()


def format_release_triggers(payload, process_one=False):
    """
    Util Function
    """
    AG = AlertGeneration
    release_trig_list = []

    list_to_process = payload
    if process_one:
        list_to_process = [payload]

    for trig in list_to_process:
        trigger_type = trig["trigger_type"]
        trigger_source = AG.get_internal_alert_symbol_row(trigger_type, return_col="trigger_source")
        alert_level = AG.get_internal_alert_symbol_row(trigger_type, return_col="alert_level")

        release_trig = {
            **trig,
            "trigger_source": trigger_source,
            "trigger_alert_level": int(alert_level),
            "trigger_timestamp": trig["timestamp"], 
        }
        release_trig_list.append(release_trig)

    if process_one:
        return release_trig_list[0]
    else:
        return release_trig_list


def get_unique_trigger_per_type(trigger_list):
    """
    Util Function
    """
    AG = AlertGeneration
    new_trigger_list = []
    unique_triggers_set = set({})
    for trigger in trigger_list:
        (trigger_id, release_id, trigger_type, timestamp, info) = trigger.values()
        trigger_source = AG.get_internal_alert_symbol_row(trigger_type, return_col="trigger_source")
        alert_level = AG.get_internal_alert_symbol_row(trigger_type, return_col="alert_level")

        if trigger_source:
            if not trigger_type in unique_triggers_set:
                unique_triggers_set.add(trigger_type)
                new_trigger_list.append({
                    "trigger_id": trigger_id,
                    "release_id": release_id,
                    "trigger_type": trigger_type,
                    "trigger_source": trigger_source,
                    "trigger_alert_level": alert_level,
                    "timestamp": timestamp, 
                    "info": info
                })

    return new_trigger_list


@PUBLIC_ALERTS_BLUEPRINT.route("/alert_gen/public_alerts/get_ongoing_and_extended_monitoring", methods=["GET"])
@PUBLIC_ALERTS_BLUEPRINT.route("/alert_gen/public_alerts/get_ongoing_and_extended_monitoring/<site_code>", methods=["GET"])
def get_ongoing_and_extended_monitoring(run_ts=dt.now(), source="fetch", site_code=None):
    """
    returns dictionary of lists

    Args:
        run_ts (Datetime)
        source (String)
    """
    release_interval_hours = 4
    extended_monitoring_days = 3 
    run_ts=dt.now()

    try:
        AG = AlertGeneration
        if site_code:
            events = AG.get_ongoing_extended_overdue_events(complete=True, include_site=True, site_code=site_code)
        else:    
            events = AG.get_ongoing_extended_overdue_events(complete=True, include_site=True)

        active_events_dict = { 
            "latest": [], "extended": [], "overdue": [],
            "routine": {}
        }
        for e in events:
            try: 
                event_data = {}
                event_id = e["event_id"]
                site_id = e["site_id"]
                event_start = e["event_start"]
                validity = e["validity"]
                status = e["status"]
                site_code = e["site_code"]

                # NOTE: Dynamic vars
                site_dynamic_vars = dv.get_site_dynamic_variables(site_id)

                release_interval_hours = int(site_dynamic_vars["release_interval_hours"])
                extended_monitoring_days = int(site_dynamic_vars["extended_monitoring_days"])

                latest_release = AG.get_event_releases(event_id=event_id, return_count=1)
                latest_release = latest_release[0]

                release_id = latest_release["release_id"]
                data_timestamp = latest_release["data_timestamp"]
                internal_alert_level = latest_release["internal_alert_level"]
                release_time = latest_release["release_time"]
                reporter_id_mt = latest_release["reporter_id_mt"]

                user_result = Users.fetch_user(profile_id=reporter_id_mt)
                reporter = ""
                if user_result:
                    result = user_result[0]
                    reporter = f"{result['firstname']} {result['lastname']}"

                data_ts = h.str_to_dt(data_timestamp)
                release_time = h.str_to_timedelta(release_time)
                rounded_data_ts = h.round_to_nearest_release_time(
                                        data_ts=data_ts,
                                        interval=release_interval_hours
                                    )
                
                if data_ts.hour == 23 and release_time.hour < release_interval_hours:
                    str_data_ts_ymd = dt.strftime(rounded_data_ts, "%Y-%m-%d")
                    str_release_time = str(release_time)
                    release_time = f"{str_data_ts_ymd} {str_release_time}"
                
                internal_alert = internal_alert_level
                event_data["site_id"] = int(site_id)
                event_data["site_code"] = site_code
                # NOTE: Unconventional
                event_data["latest_release_id"] = release_id
                event_data["data_ts"] = h.dt_to_str(data_ts)
                event_data["release_time"] = str(release_time)
                event_data["internal_alert_level"] = internal_alert
                event_data["event_start"] = event_start
                event_data["validity"] = validity
                event_data["reporter"] = reporter
                event_data["event_id"] = event_id
                event_data["event_status"] = status

                if internal_alert[0] == "A":
                    # Probably A0, A1-..., A2-..., A3-...
                    # TODO: Create a model function checking for the corresponding 
                    # alert level of A1, A2, A3
                    public_alert_level = internal_alert[1]
                elif "ND-" in internal_alert:
                    public_alert_level = 1
                elif internal_alert == "ND":
                    public_alert_level = 0
                else:
                    raise Exception("Unknown alert level in get ongoing fnx")

                event_data["public_alert_level"] = public_alert_level
                event_data["recommended_response"] = AG.get_public_alert_symbols_row(
                    alert_level=public_alert_level,
                    return_col="recommended_response"
                )
                ###########################
                # LATEST RELEASE TRIGGERS #
                ###########################
                latest_release_triggers = AG.get_release_triggers(
                    release_id=release_id
                )
                print("latest", latest_release_triggers)
                # event_data["release_triggers"] = format_release_triggers(payload=latest_release_trigger, process_one=True)
                temp = format_release_triggers(payload=latest_release_triggers, process_one=False)
                event_data.update({
                    "release_triggers": temp
                })
                print(temp)
                print(event_data)

                #########################
                # LATEST EVENT TRIGGERS #
                #########################
                all_event_triggers = AG.get_event_triggers(
                    event_id=event_id
                )
                event_data["latest_event_triggers"] = get_unique_trigger_per_type(all_event_triggers)

                if run_ts <= h.str_to_dt(validity):
                    active_events_dict["latest"].append(event_data)
                elif h.str_to_dt(validity) < run_ts:
                    # if int(event_data["public_alert_level"]) > 0:
                    #     print("Seeing an overdue")
                    #     # Late release
                    #     active_events_dict["overdue"].append(event_data)
                    # else:
                    print("Seeing an extended")
                    # Get Next Day 00:00
                    next_day = h.str_to_dt(validity) + timedelta(days=1)
                    start = dt(next_day.year, next_day.month,
                                    next_day.day, 0, 0, 0)
                    # Day 3 is the 3rd 12-noon from validity
                    end = start + timedelta(days=extended_monitoring_days)
                    current = run_ts
                    # Count the days distance between current date and
                    # day 3 to know which extended day it is
                    difference = end - current
                    day = extended_monitoring_days - difference.days
                    print(day)

                    if day <= 0:
                        print("Latest Event")
                        active_events_dict["latest"].append(event_data)
                    elif day > 0 and day <= extended_monitoring_days:
                        result = PAT.update_public_alert_event(PAT, {"status": "extended"}, {"event_id": event_id})
                        event_data["day"] = day
                        print(f"It is Day {day} of extended monitoring")
                        active_events_dict["extended"].append(event_data)
                    else:
                        print("FINISH EVENT")
                        result = PAT.update_public_alert_event(PAT, {"status": "finished"}, {"event_id": event_id})
                        print(result)

            except Exception as err:
                raise err
        
        h.var_checker("active_events_dict", active_events_dict)

        alerts_list = {
            "status": True,
            "message": "Success",
            "data": active_events_dict
        }

    except Exception as err:
        raise err
        alerts_list = {
            "status": False,
            "message": f"Failed to fetch active events data. Error: {err}"
        }

    if source == "fetch":
        return jsonify(alerts_list)
    else:
        return json.dumps(alerts_list)


@PUBLIC_ALERTS_BLUEPRINT.route("/alert_gen/public_alerts/get_site_current_status/<site_id>", methods=["GET"])
def get_site_current_status(site_id):
    """
    """
    try:
        current_alerts = get_ongoing_and_extended_monitoring(source="within")
        current_alerts = json.loads(current_alerts)["data"]
        status_keys = list(current_alerts.keys())
        status = ""
        data = None

        for key in status_keys:
            row = next(filter(lambda x: x["site_id"] == int(site_id), current_alerts[key]), None)
            if row:
                data = row
                status = key
                break
        
        return_dict = {
            "data": data,
            "message": "worked",
            "ok": True
        }
    except Exception as err:
        raise(err)
        return_dict = {
            "data": None,
            "message": "Didnt work",
            "ok": "SHET"
        }

    return jsonify(return_dict)


#############################
# insert_ewi util functions #
#############################

def identify_validity(ewi_validity, current_validity):
    """Check which validity is newer
    """
    ewi_validity = h.str_to_dt(ewi_validity)
    if current_validity not in ['', None]:
        current_validity = h.str_to_dt(current_validity)

        validity = current_validity
        if ewi_validity > current_validity:
            validity = ewi_validity
    else:
        validity = ewi_validity
    
    return validity


def save_triggers(ewi_data, event_id, release_id):
    """
    This will update the validity as well. If ewi_validity is higher than saved validity,
    then update validity.
    """
    release_triggers = ewi_data["release_triggers"]
    latest_trigger_id = None
    try:
        for trigger in release_triggers:
            if trigger["is_invalid"] == False:
                trigger_type = trigger["trigger_type"]
                timestamp = trigger["timestamp"]
                info = trigger["info"]
                print(f"Inserting pat now...")
                pat_trigger_id = PAT.insert_public_alert_trigger(PAT, event_id, release_id, trigger_type, timestamp, info)
                latest_trigger_id = pat_trigger_id
                print(f"Public alert trigger written with ID {pat_trigger_id}")
            else:
                print("invalid trigger... skipping.")

    except Exception as err:
        raise(err)

    return latest_trigger_id


def adjust_bulletin_number(site_id):
    """
    Returns updated bulletin number.
    """
    try:
        bulletin_number = PAT.fetch_site_bulletin_number(PAT, site_id=site_id)
        adjusted_bulletin_number = int(bulletin_number) + 1
        result = PAT.update_bulletin_number(PAT, site_id=site_id, bulletin_number=adjusted_bulletin_number)

        new_bulletin_number = 0
        if result:
            new_bulletin_number = adjusted_bulletin_number
    except Exception as err:
        print(err)
        raise

    return new_bulletin_number


@PUBLIC_ALERTS_BLUEPRINT.route("/insert/alert_gen/ewi", methods=["GET", "POST"])
def insert_ewi(internal_ewi_data=None):
    """
    """

    try:
        release_id = None
        update_event_container = {}
        # For routine sites
        event_validity = ""
        ewi_validity = ""
        release_list = []

        if internal_ewi_data:
            ewi_data = internal_ewi_data
        else:
            ewi_data = request.get_json()

        # Extract main necessary data
        site_id = ewi_data["site_id"]
        site_code = ewi_data["site_code"]
        data_ts = ewi_data["data_ts"]

        # TODO: Find a way to get the two ff data
        reporter_id_mt = 1
        reporter_id_ct = 2
        release_dict = {
            "data_ts": data_ts, 
            "release_time": ewi_data["release_time"],
            "comments": ewi_data["comments"],
            "reporter_id_mt": reporter_id_mt,
            "reporter_id_ct": reporter_id_ct
        }

        status = ewi_data["status"]
        if status == "routine":
            for routine_entry in ewi_data["routine_list"]:
                event_id = PAT.insert_public_alert_event(PAT,
                    site_id=site_id, event_start=data_ts, latest_rel_id=None,
                    latest_trig_id=None, validity=None, status=status
                )

                release_dict["event_id"] = event_id
                release_dict["internal_alert_level"] = routine_entry["internal_alert"]
                release_dict["bulletin_number"] = adjust_bulletin_number(site_id=site_id)

                release_list.append(release_dict)
        
        else:
            release_dict["internal_alert_level"] = ewi_data["internal_alert"]
            release_dict["bulletin_number"] = ewi_data["bulletin_number"]

            if status == "new":
                ewi_validity = h.str_to_dt(ewi_data["validity"])
                event_id = PAT.insert_public_alert_event(PAT,
                    site_id=site_id, event_start=data_ts, latest_rel_id=None,
                    latest_trig_id=None, validity=h.dt_to_str(ewi_validity), status="on-going"
                )
                try:
                    previous_event_id = ewi_data["previous_event_id"]
                    if previous_event_id:
                        PAT.update_public_alert_event(PAT, {
                            "status": "finished"
                        }, {
                            "event_id": previous_event_id
                        })
                except KeyError:
                    pass
                    
            elif status in ["on-going", "extended", "invalid", "finished"]:
                event_id = ewi_data["event_id"]

                event_validity = h.str_to_dt(AlertGeneration.get_public_alert_event_validity(event_id))

                try:
                    if ewi_data["validity"] == "":
                        ewi_validity = event_validity
                    else:
                        ewi_validity = h.str_to_dt(ewi_data["validity"])
                except TypeError:
                    ewi_validity = h.str_to_dt(ewi_data["previous_validity"])

                if status in ["extended", "invalid", "finished"]:
                    update_event_container["status"] = status
            elif status == "lowering":
                try:
                    ewi_validity = h.str_to_dt(ewi_data["validity"])
                except TypeError:
                    ewi_validity = h.str_to_dt(ewi_data["previous_validity"])
                except ValueError:
                    ewi_validity = h.str_to_dt(ewi_data["previous_validity"])

                event_id = ewi_data["event_id"]
            
            release_dict["event_id"] = event_id
            release_dict["bulletin_number"] = adjust_bulletin_number(site_id=site_id)
            release_list.append(release_dict)
        
        for release_dict in release_list:
            release_id = PAT.insert_public_alert_release(
                PAT,
                event_id=release_dict["event_id"],
                data_ts=release_dict["data_ts"],
                internal_alert=release_dict["internal_alert_level"],
                release_time=release_dict["release_time"],
                comments=release_dict["comments"],
                bulletin_number=release_dict["bulletin_number"],
                reporter_id_mt=release_dict["reporter_id_mt"],
                reporter_id_ct=release_dict["reporter_id_ct"]
            )
            update_event_container["latest_release_id"] = release_id

            if status == "routine":
                event_id = release_dict["event_id"]
            elif status in ["new", "on-going"]:
                if "extend_ND" in ewi_data or "extend_rain_x" in ewi_data:
                    # TODO: NO DATA EXTENSION VALUE
                    site_dv = dv.get_site_dynamic_variables(site_id)
                    print("SITE_DV: \n", site_dv)
                    no_data_extension_hours = int(site_dv["no_data_hours_extension"])
                    # updated_validity = h.str_to_dt(event_validity) + timedelta(hours=4)
                    updated_validity = h.str_to_dt(event_validity) + timedelta(hours=no_data_extension_hours)
                    update_event_container.update({"validity": h.dt_to_str(updated_validity)})
                else:
                    latest_trigger_id = save_triggers(ewi_data, event_id, release_id)
                    if latest_trigger_id:
                        update_event_container.update({ "latest_trigger_id": int(latest_trigger_id) })

                    new_validity = identify_validity(ewi_validity, event_validity)
                    update_event_container.update({ "validity": h.dt_to_str(new_validity) })

            event_id = PAT.update_public_alert_event(PAT, update_event_container, {
                "event_id": event_id
            })
            print(f"Event ID {event_id} was updated")

        return_data = {
            "status": True,
            "message": "EWI Release successful",
            "data": event_id
        }
    except Exception as err:
        raise(err)
        
        return_data = {
            "status": True,
            "data": None
        }

    return jsonify(return_data)
