from src.model.helper.utils import DatabaseConnection as DB
from datetime import datetime as dt
from src.api.helpers import Helpers as h
from config import APP_CONFIG


class AlertGeneration():

    def insert_alert_status(self,
                            trigger_id, ts_last_retrigger, ts_set,
                            ts_ack, alert_status, remarks,
                            user_id=1):
        """Insert alert status entry for operational triggers. 

        Args:
            trigger_id (int) -> operational trigger id
            ts_last_trigger (str dt) -> ts_updated from op trigger
            ts_set (str dt) -> ts where alert status was changed
            ts_ack (str dt) -> same ts as previous (was the "validating" set ts before)
            alert_status (int) -> 1: valid, 0: validating, -1: invalid
            remarks (str) -> info on validation
            user_id (int) -> who validated
        """
        print("INSERT ALERT STATUS")
        query = "INSERT INTO alert_status "
        query += "(ts_last_retrigger, trigger_id, ts_set, "
        query += "ts_ack, alert_status, remarks, user_id) "
        query += f"VALUES ('{ts_last_retrigger}', {trigger_id}, '{ts_set}', "
        query += f"'{ts_ack}', {alert_status}, '{remarks}', {user_id})"

        schema = "senslopedb"
        alert_id = DB.db_modify(query, schema, True)

        return alert_id

    def update_alert_status(self, update_dict, where_dict):
        """
        """
        print("UPDATE ALERT STATUS")
        try:
            query = "UPDATE alert_status "
            query += "SET "
            length = len(update_dict.items())
            for index, item in enumerate(update_dict.items()):
                value = item[1]
                if isinstance(item[1], str):
                    value = f"'{item[1]}'"
                query += f"{item[0]} = {value}"
                if index + 1 < length:
                    query += ", "
                # TODO: UPDATE TO OTHER UPDATE FF 2 lines
                elif index + 1 == length:
                    query += " "

            index = 0
            for item in where_dict.items():
                sql = "AND "
                if index == 0:
                    sql = "WHERE "
                query += f"{sql}{item[0]} = {item[1]} "

            schema = "senslopedb"
            alert_id = DB.db_modify(query, schema, True)
        except Exception as err:
            raise(err)

        return alert_id

    def fetch_alert_status(self, trigger_id):
        """
        """
        stat_row = None
        retun_dict = None
        query = "SELECT * FROM alert_status "
        query += f"WHERE trigger_id = {trigger_id}"

        schema = "senslopedb"
        stat_row = DB.db_read(query, schema)

        if stat_row:
            retun_dict = stat_row[0]

        return retun_dict

    def insert_operational_trigger(site_id, trig_sym_id, ts_updated):
        """Inserts operational_trigger table entry.

        Args:
            site_id (int) - where will the trigger be associated
            trig_sym_id (int) - trigger_sym_id - the kind of trigger
            ts_updated (str/datetime) - since this is an insert, we can assume
                            the ts and ts_updated is the same.
        """
        if isinstance(ts_updated, str):
            ts_updated = h.str_to_dt(ts_updated)
        ts = ts_updated
        query = "INSERT INTO senslopedb.operational_triggers "
        query += "(ts, site_id, trigger_sym_id, ts_updated) "
        query += f"VALUES ('{ts}', {site_id}, {trig_sym_id}, '{ts_updated}')"

        schema = "senslopedb"
        trigger_id = DB.db_modify(query, schema, True)

        return trigger_id

    def update_operational_trigger(op_trig_id, trig_sym_id, ts_updated):
        """
        Updates operational_trigger table entry: trigger_sym_id or ts_updated.

        Args:
            op_trig_id (int) - trigger_id identified the row to be updated
            trig_sym_id (int) - trigger_sym_id - the kind of trigger
            ts_updated (str/datetime) - updating ts_updated
        """
        query = f"UPDATE senslopedb.operational_triggers "
        query += f"SET trigger_sym_id={trig_sym_id}, ts_updated='{ts_updated}' "
        query += f"WHERE trigger_id = {op_trig_id}"


        schema = "senslopedb"
        result = DB.db_modify(query, schema, True)

        return result

    def fetch_recent_operational_trigger(self, site_id, trig_sym_id=None):
        """
        Returns most recent operational_trigger.

        Args:
            site_id (int) - trigger_id identified the row to be updated
            trig_sym_id (int) - trigger_sym_id - the kind of trigger
        """
        query = "SELECT * FROM operational_triggers "
        query += f"WHERE site_id = {site_id} "
        if trig_sym_id:
            query += f"AND trigger_sym_id = {trig_sym_id} "
        query += "ORDER BY ts_updated DESC"

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        if result:
            result = result[0]

        return result


    def get_ongoing_extended_overdue_events(site_id=None, complete=False, include_site=False):
        """
        Returns ongoing, extended, and routine events
        """
        sites_db = APP_CONFIG["sites_schema"]
        select_option = "site_id, status"
        if complete:
            select_option = "public_alert_event.*"

        select_option = f"{select_option}, sites.site_code, public_alert_event.id as event_id " if include_site else select_option

        query = f"SELECT {select_option} FROM public_alert_event"
        if include_site:
            query = f"{query} INNER JOIN {sites_db}.sites ON (sites.id = public_alert_event.site_id)"
        query = f"{query} WHERE status in ('on-going', 'extended')"

        # schema = DB.db_switcher(site_id)
        schema = "senslopedb"
        result = DB.db_read(query, schema)
        return result

    def get_public_alert_event(event_id, include_site=False):
        """
        Returns event row. There is an option to include site details
        """
        sites_db = APP_CONFIG["sites_schema"]
        query = "SELECT public_alert_event.*"
        if include_site:
            query = f"{query}, {sites_db}.sites.*"
        query = f"{query} FROM public_alert_event"
        if include_site:
            query = f"{query} INNER JOIN {sites_db}.sites sites.id = public_alert_event.site_id"
        query = f"{query} WHERE public_alert_event.id = {event_id}"

        # schema = DB.db_switcher("senslopedb")
        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return result

    def get_public_alert_event_validity(event_id, include_site=False):
        """
        Returns event row. There is an option to include site details
        """
        query = f"SELECT validity FROM public_alert_event \
            WHERE public_alert_event.id = {event_id}"

        # schema = DB.db_switcher(site_id)
        schema = "senslopedb"
        result = DB.db_read(query, schema)

        if result:
            result = result[0]["validity"]

        return result

    def get_event_releases(event_id, sort_order="desc", return_count=None, complete=False):
        """
        Returns public_alert_releases row/s
        """
        select_option = "id as release_id, data_timestamp, internal_alert_level, release_time, reporter_id_mt"
        if complete:
            select_option = "*"

        query = f"SELECT {select_option} FROM public_alert_release \
                WHERE event_id = {event_id} "

        order = "ASC" if sort_order in ["asc", "ASC"] else "DESC"
        query = f"{query} ORDER BY id {order}"

        query = f"{query} LIMIT {return_count}" if return_count else query

        # schema = DB.db_switcher(site_id)
        schema = "senslopedb"
        result = DB.db_read(query, schema)
        print(result)
        if not complete:
            result = [result[0]]

        return result


    def get_event_triggers(event_id, sort_order="desc", return_count=None, complete=False):
        """
        Returns public_alert_trigger row/s
        """
        select_option = "id as trigger_id, release_id, trigger_type, timestamp, info"
        if complete:
            select_option = "*"

        query = f"SELECT {select_option} FROM public_alert_trigger \
                WHERE event_id = {event_id}"
        order = "ASC" if sort_order in ["asc", "ASC"] else "DESC"
        query = f"{query} ORDER BY timestamp {order}"

        query = f"{query} LIMIT {return_count}" if return_count else query

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        if not complete:
            result = [result[0]]
    
        return result


    def get_release_triggers(release_id, sort_order="desc", return_count=None, complete=False):
        """
        Returns public_alert_trigger row/s
        """
        select_option = "id as trigger_id, release_id, trigger_type, timestamp, info"
        if complete:
            select_option = "*"

        query = f"SELECT {select_option} FROM public_alert_trigger \
                WHERE release_id = {release_id}"
        order = "ASC" if sort_order in ["asc", "ASC"] else "DESC"
        query = f"{query} ORDER BY timestamp {order}"

        query = f"{query} LIMIT {return_count}" if return_count else query

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return result

    ###################################
    # MINI QUERIES
    ###################################

    def get_public_alert_symbols_row(alert_level=None, alert_symbol=None, return_col=None):
        """
        Returns public_alert_symbols row or value itself
        """
        select_option = "*"
        if return_col:
            if return_col == "pas_id":
                select_option = "id as pas_id"
            else:
                select_option = return_col

        query = f"SELECT {select_option} FROM public_alert_symbols WHERE "

        # Either you give level or symbol. Pretty obvious one.
        if alert_level != None:
            query = f"{query} alert_level = {alert_level}"
        elif alert_symbol:
            query = f"{query} alert_symbol = {alert_symbol}"

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return_data = None
        if return_col:
            return_data = result[0][return_col]
        else:
            return_data = result[0]

        return return_data

    def get_ias_table():
        """
        Util miniquery
        """
        select_option = f"ias.id as internal_sym_id, \
                    ias.trigger_sym_id, \
                    ias.alert_symbol as ias_symbol, \
                    ots.alert_symbol as ots_symbol, \
                    ots.alert_description, \
                    alert_level, \
                    trigger_source"
        query = f"SELECT {select_option} FROM " + \
                "senslopedb.internal_alert_symbols ias " + \
            "INNER JOIN " + \
                "operational_trigger_symbols ots ON (ots.id = ias.trigger_sym_id" + \
            "INNER JOIN " + \
                "trigger_hierarchies th ON (th.id = ots.source_id)"

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return result


    def get_ias_by_lvl_source(trigger_source, alert_level, return_col=None):
        """
        Util miniquery
        """
        select_option = f"ias.id as internal_sym_id, \
                    ias.trigger_sym_id, \
                    ias.alert_symbol as ias_symbol, \
                    ots.alert_symbol as ots_symbol, \
                    ots.alert_description, \
                    ots.alert_level, \
                    trigger_source"
        if return_col:
            select_option = return_col
        query = f"SELECT {select_option} FROM " + \
                "senslopedb.internal_alert_symbols ias " + \
            "INNER JOIN " + \
                "operational_trigger_symbols ots ON (ots.id = ias.trigger_sym_id) " + \
            "INNER JOIN " + \
                "trigger_hierarchies th ON (th.id = ots.source_id)"

        query = f"{query} WHERE trigger_source = '{trigger_source}' "
        query = f"{query} AND alert_level = {alert_level}"

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        if return_col:
            return_col = "alert_symbol" if return_col == "ias.alert_symbol" else return_col
            result = result[0][return_col]

        return result


    def get_internal_alert_symbol_row(trigger_type=None, trigger_symbol=None, return_col=None):
        """
        Util miniquery
        """
        select_option = f"ias.id as internal_sym_id, \
                    ias.trigger_sym_id, \
                    ias.alert_symbol as ias_symbol, \
                    ots.alert_symbol as ots_symbol, \
                    ots.alert_description, \
                    ots.alert_level, \
                    trigger_source"
        if return_col:
            select_option = return_col
            if return_col == "ias.alert_symbol":
                return_col = "ias_symbol"
            elif return_col == "ots.alert_symbol":
                return_col = "ots_symbol"
            select_option = f"{select_option} as {return_col}"
        query = f"SELECT {select_option} FROM " + \
                "senslopedb.internal_alert_symbols ias " + \
            "INNER JOIN " + \
                "operational_trigger_symbols ots ON (ots.id = ias.trigger_sym_id) " + \
            "INNER JOIN " + \
                "trigger_hierarchies th ON (th.id = ots.source_id)"

        if trigger_type:
            query = f"{query} WHERE BINARY ias.alert_symbol = '{trigger_type}'"
        else:
            if trigger_symbol:
                query = f"{query} WHERE BINARY ots.alert_symbol = '{trigger_symbol}'"

        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return_data = None
        if return_col:
            if result:
                return_data = result[0][return_col]
        else:
            if result:
                return_data = result[0]

        return return_data


    def get_operational_trigger_symbol(trigger_source, alert_level, return_col=None):
        """
        Returns tuple operational_trigger row

        Args:
            trigger_source (str) - 
            alert_level (int) - 
        """
        select_option = "ots.*, ots.id as trigger_sym_id"
        if return_col:
            if return_col == "trigger_sym_id":
                select_option = "ots.id as trigger_sym_id"
            else:
                select_option = return_col
        query = f"SELECT {select_option} FROM operational_trigger_symbols as ots "
        query += "INNER JOIN trigger_hierarchies as th ON (th.id = ots.source_id) "
        query += f"WHERE th.trigger_source = '{trigger_source}' "
        query += f"AND ots.alert_level = {alert_level}"

        schema = "senslopedb"
        result = DB.db_read(query, schema)
        
        return_data = result[0]
        if return_col:
            return_data = result[0][return_col]

        return return_data

    def get_trigger_hierarchy(source_id, return_col=None):
        select_option = "*, id as source_id"
        if return_col:
            select_option = return_col

        query = f"SELECT {select_option} FROM trigger_hierarchies"
        query = f"{query} WHERE id = {source_id}"
        schema = "senslopedb"
        result = DB.db_read(query, schema)

        return_data = result[0]
        if return_col:
            return_data = result[0][return_col]

        return return_data
