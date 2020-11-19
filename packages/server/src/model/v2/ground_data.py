from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers


class GroundData():

    ################
    # SURFICIAL
    ################

    def insert_marker_observation(data):
        try:
            ts = data["ts"]
            weather = data["weather"]
            observer = data["observer"]
            site_id = data["site_id"]

            query = f'INSERT INTO marker_observations VALUES (0, "{site_id}", "{ts}", "EVENT", ' \
                f'"{observer}", "APP", 1, "{weather}");'
            mo_id = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True, "mo_id": mo_id}
        except Exception as err:
            result = {"status": False, "message": err}
        finally:
            return result


    def insert_marker_values(id, value, mo_id):
        try:
            query = f'INSERT INTO marker_data VALUES (0, {mo_id}, {id}, {value})'
            mo_id = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True, "data": mo_id}
        except Exception as err:
            result = {"status": False, "message": err}
        finally:
            return result


    def fetch_surficial_mo_id(ts, site_id):
        query = f'SELECT id as mo_id FROM senslopedb.marker_observations WHERE ts = "{ts}" and site_id = "{site_id}" limit 1;'
        result = DB.db_read(query, 'senslopedb')
        return result


    def fetch_marker_ids_v_moid(mo_id):
        query = f'SELECT marker_id, marker_name FROM senslopedb.marker_data md ' \
            f'INNER JOIN senslopedb.marker_names mn ON (md.marker_id = mn.id) where mo_id = "{mo_id}";'
        result = DB.db_read(query, 'senslopedb')
        return result


    def fetch_surficial_data(site_id):
        query = f'SELECT ts, measurement, marker_name, observer_name, weather ' \
                f'FROM senslopedb.site_markers sm INNER JOIN ' \
                f'cbewsl_commons_db.sites s ON (s.id = sm.site_id) INNER JOIN ' \
                f'senslopedb.marker_data md ON (md.marker_id = sm.marker_id) INNER JOIN senslopedb.marker_observations mo ON (mo.id = md.mo_id) ' \
                f'WHERE s.id = "{site_id}" ORDER BY ts desc limit 100;'
        result = DB.db_read(query, 'senslopedb')
        return result


    def fetch_latest_surficial_data(site_id):
        query = f"""
            SELECT 
                *, marker_observations.id as mo_id
            FROM
                marker_observations
            WHERE
                site_id = {site_id}
            ORDER BY ts DESC
            LIMIT 1;
        """
        result = []
        mo_result = DB.db_read(query, 'senslopedb')
        if mo_result:
            mo_id = mo_result[0]["mo_id"]
            query = f"""
                SELECT 
                    marker_name, measurement
                FROM
                    marker_data md
                        JOIN
                    site_markers sm ON (sm.marker_id = md.marker_id)
                WHERE
                    mo_id = {mo_id}; 
            """
            result = DB.db_read(query, 'senslopedb')

            if result:
                temp = []
                for item in result:
                    stuff = (item["marker_name"], item["measurement"])
                    temp.append(stuff)
                
                result = [{
                    "data_list": temp,
                    "ts": mo_result[0]["ts"],
                    "observer_name": mo_result[0]["observer_name"],
                    "weather": mo_result[0]["weather"],
                    "data_source": mo_result[0]["data_source"]
                }]
            else:
                raise ValueError("Database inconsistent. MO has no corresponding marker data.")

        return result


    def fetch_surficial_operational_trigger(site_id, latest_ts):
        query = f"""
            SELECT 
                ot.site_id,
                ot.ts_updated as ts,
                ots.alert_symbol,
                ots.alert_description
            FROM
                operational_triggers ot
                    JOIN
                operational_trigger_symbols ots ON (ots.id = ot.trigger_sym_id)
                    JOIN
                trigger_hierarchies th ON (th.id = ots.source_id)
            WHERE
                ot.site_id = {site_id}
            AND
                ot.ts_updated = "{latest_ts}"
            AND
                th.trigger_source = "surficial"
        """
        result = DB.db_read(query, 'senslopedb')
        return result


    def fetch_surficial_plot_data(marker_id, site_code, start, end):
        query = f'SELECT mo_id, id, marker_id, ts as x, measurement as y FROM senslopedb.marker_data md INNER ' \
                f'JOIN marker_observations  mo ON (mo.id = md.mo_id) WHERE (ts BETWEEN "{start}" AND "{end}") and marker_id = {marker_id} ' \
                'order by ts asc;'
        result = DB.db_read(query, 'senslopedb')
        return result


    def fetch_surficial_markers(site_id):
        query = f'SELECT marker_id, marker_name ' \
            f'FROM senslopedb.site_markers sm INNER JOIN cbewsl_commons_db.sites s ON (s.id = sm.site_id) ' \
            f'WHERE s.id = "{site_id}" ORDER BY marker_name;'
        result = DB.db_read(query, 'senslopedb')
        return result


    def update_surficial_marker_values(mo_id, marker_id, value):
        query = f'UPDATE marker_data set measurement="{value}" WHERE marker_id = "{marker_id}" AND mo_id = "{mo_id}";'
        result = DB.db_modify(query, 'senslopedb', True)
        return result


    def update_surficial_marker_observation(mo_id, ts, weather, observer, site_id):
        try:
            query = f'UPDATE marker_observations SET ts = "{ts}", ' \
                f'observer_name = "{observer}", weather = "{weather}" ' \
                f'WHERE site_id = "{site_id}" AND id = "{mo_id}";'
            update_status = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True, "data": update_status}
        except Exception as err:
            result = {"status": False, "message": err}
        finally:
            return result


    def delete_marker_observation(surficial_data):
        try:
            if 'mo_id' in surficial_data:
                mo_id = surficial_data['mo_id']
                site_id = surficial_data['site_id']
                query = f'DELETE FROM marker_observations WHERE id="{mo_id}" AND site_id="{site_id}'
            else:
                ts = surficial_data['ts']
                weather = surficial_data['weather']
                observer = surficial_data['observer']
                site_id = surficial_data['site_id']
                query = f'DELETE FROM marker_observations WHERE ts="{ts}" ' \
                        f'AND weather="{weather}" AND observer_name="{observer}" AND site_id = "{site_id}" ' \
                        'AND IFNULL(id, 0) = LAST_INSERT_ID(id);'
            mo_status = DB.db_modify(query, 'senslopedb', True)
            if mo_status is None:
                result = {"status": True, "mo_id": mo_id}
            else:
                result = {"status": True, "mo_id": mo_status}
        except Exception as err:
            print(err)
            result = {"status": False, "mo_id": None}
        finally:
            return result


    def delete_marker_values(mo_id):
        try:
            query = f'DELETE FROM marker_data WHERE mo_id = "{mo_id}"'
            status = DB.db_modify(query, 'senslopedb', True)
            result = {
                "status": True, "message": f"Successfully delete surficial data. => {status}"}
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to delete marker value. => {err}"}
        finally:
            return result


    ################
    # MOMS
    ################

    def insert_moms_feature(data):
        """
            Returns feature_id of inserted feature type
        """
        try:
            feature_type = data["feature_type"]
            description = None
            last_ts = Helpers.dt_to_str(dt.today())

            try:
                description = data["description"]
            except KeyError:
                pass

            if description:
                temp_desc = f"'{description}'"
            else:
                temp_desc = f"NULL"

            query = f"INSERT INTO moms_features (feature_id, feature_type, description, last_ts) "
            query += f"VALUES (0, '{feature_type}', {temp_desc}, '{last_ts}')"
            print(query)
            feature_id = DB.db_modify(query, 'senslopedb', True)
        except Exception as err:
            raise(err)

        return feature_id


    def insert_moms_instance(data):
        try:
            site_id = data["site_id"]
            feature_id = data["feature_id"]
            feature_name = data["feature_name"]
            location = data["location"]
            reporter = data["reporter"]
            last_ts = Helpers.dt_to_str(dt.today())

            query = f"INSERT INTO moms_instances (instance_id, site_id, feature_id, "
            query += f"feature_name, location, reporter, last_ts) VALUES (0, {site_id}, "
            query += f"{feature_id}, '{feature_name}', '{location}', '{reporter}', '{last_ts}')"

            print(query)
            status = DB.db_modify(query, 'senslopedb', True)
            result = status
            print(status)
        except Exception as err:
            Helpers.var_checker("Error", err)
        finally:
            return result


    def insert_moms_record(instance_id, observance_ts, remarks,
                           reporter_id, alert_level=0, validator_id=None):
        """
        Inserts monitoring_moms row

        Args:
            instance_id (int) - instance_id of the feature to be reported
            observance_ts (str/datetime) - observance_ts of the moms report
            remarks (str) - remarks of the moms report
            reporter_id (int) - in CBEWSL, one reporter and
                                validator is enough - user_id
            alert_level (int) - op_trigger of the moms report
            validator_id (int) - in CBEWSL, one reporter and
                                validator is enough - user_id
        """

        # TODO: THIS LOGIC SHOULD NOT BE HERE. MOVE TO API.
        try:
            if isinstance(observance_ts, str):
                observance_ts = Helpers.str_to_dt(observance_ts)
            if not validator_id:
                validator = reporter_id
            last_ts = Helpers.dt_to_str(dt.today())
        except Exception as err:
            print(err)
            raise

        query = f"""
            INSERT INTO monitoring_moms 
            (instance_id, observance_ts, reporter_id, remarks, validator, op_trigger, last_ts)
            VALUES ({instance_id}, '{observance_ts}', {reporter_id}, '{remarks}', {validator}, {alert_level}, '{last_ts}')
        """
        moms_id = DB.db_modify(query, 'senslopedb', True)
        
        return moms_id


    def fetch_moms_features():
        try:
            query = 'SELECT id as feature_id, feature_type FROM moms_features'
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to retrieve MoMs features. => {err}"}
        finally:
            return result


    def fetch_moms_features_by_type(f_type):
        try:
            query = f'SELECT id as feature_id, feature_type, description FROM moms_features WHERE feature_type = "{f_type}"'
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to retrieve MoMs features by type. => {err}"}
        finally:
            return result


    def fetch_feature_id(feature_type, site_id=None):
        """
            Returns {"feature_id": <feature_id value>} of searched feature type
        """
        try:
            query = f"SELECT id as feature_id FROM moms_features WHERE feature_type = '{feature_type}'"
            feature_id = DB.db_read(query, 'senslopedb')
        except Exception as err:
            raise(err)

        return feature_id


    def fetch_moms(site_id):
        try:
            query = f"""
                SELECT 
                    mm.*, mm.id as moms_id, mf.feature_type, mi.*, mi.id as instance_id, CONCAT(user_prof.firstname, " ", user_prof.lastname) as moms_reporter
                FROM
                    moms_instances AS mi
                        INNER JOIN
                    monitoring_moms AS mm ON (mm.instance_id = mi.id)
                        INNER JOIN
                    moms_features AS mf ON (mf.id = mi.feature_id)
                        INNER JOIN
                    cbewsl_commons_db.user_accounts AS users ON users.id = mm.reporter_id 
                        INNER JOIN
                    cbewsl_commons_db.user_profiles AS user_prof ON user_prof.id = users.profile_id
                WHERE
                    mi.site_id = {site_id}
                ORDER BY observance_ts DESC;
            """
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to fetch moms. => {err}"}
        finally:
            return result


    def fetch_moms_by_moms_id(moms_id):
        try:
            query = f'SELECT *, id as moms_id FROM monitoring_moms WHERE id = {moms_id}'
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to fetch moms by id. => {err}"}
        finally:
            return result


    def fetch_moms_instance_by_instance_id(instance_id):
        try:
            query = f'SELECT *, id as instance_id FROM moms_instances WHERE id = {instance_id}'
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to fetch moms instance. => {err}"}
        finally:
            return result


    def fetch_moms_instance_by_feature_id(feature_id, feature, site_id):
        try:
            if isinstance(feature, str) and feature != '':
                query = f'SELECT id as instance_id, feature_name, location, reporter FROM moms_instances WHERE feature_name = "{feature}" AND ' \
                    f'site_id = {site_id} AND feature_id = {feature_id}'
            else:
                query = f'SELECT id as instance_id, feature_name, location, reporter FROM moms_instances WHERE ' \
                    f'site_id = {site_id} AND feature_id = {feature_id}'
            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to retrieve MoMs data. => {err}"}
        finally:
            return result


    def fetch_moms_instances_by_feature_id_joined(feature_id=None, site_id=None):
        try:
            query = """
                SELECT 
                    mi.*,
                    mf.feature_type,
                    mf.id as feature_id,
                    CONCAT(mf.feature_type, ' ', mi.feature_name) name
                FROM
                    moms_instances AS mi
                        INNER JOIN
                    moms_features AS mf ON (mf.id = mi.feature_id)
            """

            if feature_id:
                query += f" WHERE feature_id = {feature_id}"
                if site_id:
                    query += f" AND site_id = {site_id}"
            else:
                query += f" WHERE site_id = {site_id}"

            result = DB.db_read(query, 'senslopedb')
        except Exception as err:
            result = {"status": False,
                "message": f"Failed to fetch moms instance. => {err}"}
        finally:
            return result
    

    def fetch_latest_moms(site_id):
        query = f"""
            SELECT 
                site_code,
                observance_ts,
                feature_type,
                feature_name,
                remarks,
                reporter,
                location
            FROM
                monitoring_moms
                    JOIN
                moms_instances ON (moms_instances.id = monitoring_moms.instance_id)
                    JOIN
                moms_features ON (moms_features.id = moms_instances.feature_id)
                    JOIN
                cbewsl_commons_db.sites as sites ON (sites.id = moms_instances.site_id)
            WHERE
                sites.id = {site_id}
            ORDER BY observance_ts DESC
            LIMIT 1;
        """

        result = DB.db_read(query, 'senslopedb')

        return result


    def update_moms_instance(data):
        query = "UPDATE moms_instances SET"
        counter = 0

        try:
            for x in data:
                key = list(x)[0]
                # if key not in ["moms_id", "feature_type", "feature_name", "site_id", "location", "reporter"]:
                if key != "instance_id":
                    if counter == 0:
                        query += f" {key} = '{x[key]}'"
                    else:
                        query += f", {key} = '{x[key]}'"
                    counter += 1

            for x in data:
                key = list(x)[0]
                if 'instance_id' == key:
                    query = f"{query}, last_ts = '{Helpers.dt_to_str(dt.today())}' WHERE id = '{x[key]}'"

            print(query)
            DB.db_modify(query, 'senslopedb', True)
        except Exception as err:
            raise(err)
    

    def update_moms_feature(data):
        query = "UPDATE moms_features SET"
        counter = 0

        try:
            for x in data:
                key = list(x)[0]
                # if key not in ["moms_id", "feature_type", "feature_name", "site_id", "location", "reporter"]:
                if key != "feature_id":
                    if counter == 0:
                        query += f" {key} = '{x[key]}'"
                    else:
                        query += f", {key} = '{x[key]}'"
                    counter += 1

            for x in data:
                key = list(x)[0]
                if 'feature_id' == key:
                    query = f"{query}, last_ts = '{Helpers.dt_to_str(dt.today())}' WHERE id = '{x[key]}'"

            print(query)
            ret_val = DB.db_modify(query, 'senslopedb', True)
            print(ret_val)
        except Exception as err:
            raise(err)

        return ret_val


    def update_monitoring_moms(data):
        query = "UPDATE monitoring_moms SET"
        counter = 0

        try:
            for x in data:
                key = list(x)[0]
                if key not in ["moms_id", "op_trigger"]:
                    if counter == 0:
                        query += f" {key} = '{x[key]}'"
                    else:
                        query += f", {key} = '{x[key]}'"
                    counter += 1

            for x in data:
                key = list(x)[0]
                if 'moms_id' == key:
                    query = f"{query}, last_ts = '{Helpers.dt_to_str(dt.today())}' WHERE id = '{x[key]}'"
        
            ret_val = DB.db_modify(query, 'senslopedb', True)
        except Exception as err:
            raise(err)

        return ret_val

    def delete_moms_observation(moms_id):
        try:
            query = f'DELETE FROM monitoring_moms WHERE id = {moms_id}'
            update_status = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True,
                "data": update_status, "message": "Success"}
        except Exception as err:
            print(err)
            result = {"status": False, "message": err}
        finally:
            return result


    def delete_moms_feature(feature_id):
        try:
            query = f'DELETE FROM moms_features WHERE id = {feature_id}'
            update_status = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True, "data": update_status, "message": "Success"}
        except Exception as err:
            print(err)
            result = {"status": False, "message": err}
        finally:
            return result


    def delete_moms_instance(instance_id):
        try:
            query = f'DELETE FROM moms_instances WHERE id = {instance_id}'
            update_status = DB.db_modify(query, 'senslopedb', True)
            result = {"status": True, "data": update_status, "message": "Success"}
        except Exception as err:
            print(err)
            result = {"status": False, "message": err}
        finally:
            return result


    ###############
    # ON DEMAND
    ###############

    def get_latest_od_events(site_id):
        query = "SELECT id as od_id, ts, site_id, reason, reporter, alert_level FROM public_alert_on_demand "
        query += f"WHERE site_id = {site_id} "
        query += "ORDER BY ts DESC"
        print(query)

        od_data = DB.db_read(query, 'senslopedb')

        return od_data


    def insert_on_demand_alert(ts, site_id, reason, reporter, alert_level):
        """
        """
        try:
            query = "INSERT INTO public_alert_on_demand (ts, site_id, reason, reporter, alert_level) " \
                    f"VALUES ('{ts}', {site_id}, '{reason}', '{reporter}', {alert_level})"
            od_id = DB.db_modify(query, "senslopedb", last_insert_id=True)
            result = {"status": True, "data": od_id, "message": "Success" }
        except Exception as err:
            print(err)
            result = {"status": False, "data": None, "message": err }

        return result
