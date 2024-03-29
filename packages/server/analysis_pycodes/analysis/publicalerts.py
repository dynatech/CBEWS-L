from datetime import datetime, timedelta, time
import pprint
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import querydb as qdb
import techinfomaker as tech_info_maker


def var_checker(var_name, var, have_spaces=True):
    """
    A function used to check variable value including
    title and indentation and spacing for faster checking
    and debugging.

    Args:
    var_name (String): the variable name or title you want display
    var (variable): variable (any type) to display
    have_spaces (Boolean): keep False is you dont need spacing for each display.
    """
    if have_spaces:
        print()
        print(f"===== {var_name} =====")
        printer = pprint.PrettyPrinter(indent=4)
        printer.pprint(var)
        print()
    else:
        print(f"===== {var_name} =====")
        printer = pprint.PrettyPrinter(indent=4)
        printer.pprint(var)

def str_to_dt(string_value):
    return datetime.strptime(string_value, "%Y-%m-%d %H:%M:%S")


# LOUIE - disabled original code for rounding timestamp to release times.
def release_time(date_time):
    """Rounds time to 4/8/12 AM/PM.

    Args:
        date_time (datetime): Timestamp to be rounded off. 04:00 to 07:30 is
        rounded off to 8:00, 08:00 to 11:30 to 12:00, etc.

    Returns:
        datetime: Timestamp with time rounded off to 4/8/12 AM/PM.

    """
    try:
        hour = date_time.hour
        interval = 4

        quotient = int(hour / interval)
        hour_of_release = (quotient + 1) * interval

        if hour_of_release < 24:
            date_time = datetime.combine(
                date_time.date(), time((quotient + 1) * interval, 0))
        else:
            date_time = datetime.combine(date_time.date() + timedelta(1), time(0, 0))
    except Exception as err:
        print(err + "1 1")
        raise

    return date_time


def round_data_ts(date_time):
    """Rounds time to HH:00 or HH:30.

    Args:
        date_time (datetime): Timestamp to be rounded off. Rounds to HH:00
        if before HH:30, else rounds to HH:30.

    Returns:
        datetime: Timestamp with time rounded off to HH:00 or HH:30.

    """

    hour = date_time.hour
    minute = date_time.minute

    if minute < 30:
        minute = 0
    else:
        minute = 30

    date_time = datetime.combine(date_time.date(), time(hour, minute))
    
    return date_time


def check_if_has_unresolved_moms_instance(site_moms_alerts_df):
    """
    ASK MERYLL IF CORRECT
    """
    unresolved = []
    if not site_moms_alerts_df.empty:
        unique = site_moms_alerts_df.drop_duplicates(subset="instance_id", keep="first", inplace=False)
        unresolved = unique.loc[unique["op_trigger"] >= 2, :]

    return unresolved, len(unresolved) > 0


def get_site_moms_alerts(site_id, start, end):
    """
    Returns sorted site moms and 
    highest moms alert level or -1 if no moms is in db

    Args:
        TODO
    """

    query = "SELECT * FROM senslopedb.monitoring_moms as moms"
    query = f"{query} JOIN senslopedb.moms_instances as mi"
    query = f"{query} ON moms.instance_id = mi.id"
    query = f"{query} JOIN cbewsl_commons_db.sites as site"
    query = f"{query} ON mi.site_id = site.id"
    query = f"{query} WHERE site.id = {site_id}"
    query = f"{query} AND moms.observance_ts >= '{start}'"
    query = f"{query} AND moms.observance_ts <= '{end}'"
    query = f"{query} ORDER BY moms.observance_ts DESC"

    site_moms_alerts_df = qdb.get_db_dataframe(query)
    sorted_df = site_moms_alerts_df.sort_values(['op_trigger'], ascending=[False])

    moms_op_trigger = 0
    if not sorted_df.empty:
        moms_op_trigger = sorted_df.iloc[0]["op_trigger"]
    else:
        moms_op_trigger = -1

    return site_moms_alerts_df, moms_op_trigger

def get_ground_data_last_ts(site_id):
    """
    Returns timestamp of last ground data inserted to the database
    """
    query =  "(SELECT last_ts as ts FROM moms_instances WHERE site_id = %s) " %site_id
    query+=  "UNION "
    query+=  "(SELECT ts FROM tsm_sensors AS tsm "
    query+=  "JOIN node_alerts AS na "
    query+=  "ON tsm.id = na.tsm_id "
    query+=  "WHERE site_id = %s) " %site_id
    query+=  "UNION "
    query+=  "(SELECT ts FROM marker_observations WHERE site_id = %s) " %site_id
    query+=  "ORDER BY ts DESC "
    query+=  "LIMIT 1"

    ground_data_last_ts = qdb.get_db_dataframe(query)
    
    return ground_data_last_ts

def get_public_symbols():
    """Dataframe containing public alert level and its corresponding symbol.
    """

    query = "SELECT *, id as pub_sym_id FROM public_alert_symbols"

    public_symbols = qdb.get_db_dataframe(query)
    public_symbols = public_symbols.sort_values(['alert_type', 'alert_level'],
                                                ascending=[True, False])

    return public_symbols

def get_internal_symbols():
    """Dataframe containing trigger alert level, source and, 
    hierarchy in writing its symbol in internal alert
    """
    query =  """
        SELECT 
            trigger_sym_id,
            source_id,
            trigger_source,
            alert_level,
            alert_symbol,
            hierarchy_id
        FROM
            (SELECT 
                op.id AS trigger_sym_id,
                    source_id,
                    alert_level,
                    inte.alert_symbol
            FROM
                internal_alert_symbols AS inte
            INNER JOIN operational_trigger_symbols AS op ON op.id = inte.trigger_sym_id) AS sub
                INNER JOIN
            trigger_hierarchies AS trig ON trig.id = sub.source_id
        ORDER BY hierarchy_id
    """
    internal_symbols = qdb.get_db_dataframe(query)
    
    return internal_symbols

def get_trigger_symbols():
    """Dataframe containing operational trigger alert level and 
    its corresponding id/symbol.
    """

    query =  "SELECT op.id as trigger_sym_id, alert_level, alert_symbol, "
    query += "op.source_id, trigger_source FROM "
    query += "  operational_trigger_symbols AS op "
    query += "INNER JOIN "
    query += "  trigger_hierarchies AS trig "
    query += "ON op.source_id = trig.id"
    
    trig_symbols = qdb.get_db_dataframe(query)
    
    return trig_symbols


def get_moms_feature_types():
    """Dataframe containing moms feature types for use in tech info
    """

    query = "SELECT id as feature_id, feature_type FROM moms_features"

    moms_types = qdb.get_db_dataframe(query)

    return moms_types


def event_start(site_id, end):
    """Timestamp of start of event monitoring. Start of event is computed
    by checking if event progresses from non A0 to higher alert.

    Args:
        site_id (int): ID of each site.
        end (datetime): Current public alert timestamp.

    Returns:
        datetime: Timestamp of start of monitoring.
    """

    query =  "SELECT ts, ts_updated FROM "
    query += "  (SELECT * FROM public_alerts "
    query += "  WHERE site_id = %s " %site_id
    query += "  AND (ts_updated <= '%s' " %end
    query += "    OR (ts_updated >= '%s' " %end
    query += "      AND ts <= '%s')) " %end
    query += "  ) AS pub " %site_id
    query += "INNER JOIN "
    query += "  (SELECT * FROM public_alert_symbols "
    query += "  WHERE alert_type = 'event') AS sym "
    query += "ON pub.pub_sym_id = sym.id "
    query += "ORDER BY ts DESC LIMIT 3"
    
    # previous positive alert
    prev_pub_alerts = qdb.get_db_dataframe(query)

    if len(prev_pub_alerts) == 1:
        start_monitor = pd.to_datetime(prev_pub_alerts['ts'].values[0])
    # two previous positive alert
    elif len(prev_pub_alerts) == 2:
        # one event with two previous positive alert
        if pd.to_datetime(prev_pub_alerts['ts'].values[0]) - \
                pd.to_datetime(prev_pub_alerts['ts_updated'].values[1]) <= \
                timedelta(hours=0.5):
            start_monitor = pd.to_datetime(prev_pub_alerts['ts'].values[1])
        else:
            start_monitor = pd.to_datetime(prev_pub_alerts['ts'].values[0])
    # three previous positive alert
    else:
        if pd.to_datetime(prev_pub_alerts['ts'].values[0]) - \
                pd.to_datetime(prev_pub_alerts['ts_updated'].values[1]) <= \
                timedelta(hours=0.5):
            # one event with three previous positive alert
            if pd.to_datetime(prev_pub_alerts['ts'].values[1]) - \
                    pd.to_datetime(prev_pub_alerts['ts_updated'].values[2]) \
                    <= timedelta(hours=0.5):
                start_monitor = pd.to_datetime(prev_pub_alerts['ts']\
                        .values[2])
            # one event with two previous positive alert
            else:
                start_monitor = pd.to_datetime(prev_pub_alerts['ts'].values[1])
        else:
            start_monitor = pd.to_datetime(prev_pub_alerts['ts'].values[0])

    return start_monitor

def get_monitoring_type(site_id, end):
    """Type of monitoring: 'event' or 'routine'. Extended monitoring is tagged
    as 'routine' since it requires surficial data once a day. For simplicity,
    sites not under monitoring (event, extended, routine) are tagged 'routine'.

    Args:
        site_id (int): ID of each site.
        end (datetime): Current public alert timestamp.

    Returns:
        str: 'event' or 'routine'.
    """

    query =  "SELECT alert_type FROM "
    query += "  (SELECT * FROM public_alerts "
    query += "  WHERE site_id = %s " %site_id
    query += "  AND ((ts_updated <= '%s' " %end
    query += "      AND ts_updated >= '%s') " %(end - timedelta(hours=0.5))
    query += "    OR (ts_updated >= '%s' " %end
    query += "      AND ts <= '%s')) " %end
    query += "  ORDER BY ts DESC LIMIT 1 "
    query += "  ) AS pub "
    query += "INNER JOIN "
    query += "  public_alert_symbols AS sym "
    query += "ON pub.pub_sym_id = sym.id"
            
    monitoring_type = qdb.get_db_dataframe(query)['alert_type'].values[0]
    
    return monitoring_type

def get_operational_trigger(site_id, start_monitor, end):
    """Dataframe containing alert level on each operational trigger
    from start of monitoring.

    Args:
        site_id (dataframe): ID each site.
        start_monitor (datetime): Timestamp of start of monitoring.
        end (datetime): Public alert timestamp.

    Returns:
        dataframe: Contains timestamp range of alert, three-letter site code,
                   operational trigger, alert level, and alert symbol from
                   start of monitoring
    """

    query =  "SELECT op.id as trigger_id, op.trigger_sym_id, ts, site_id, source_id, alert_level, "
    query += "alert_symbol, ts_updated FROM"
    query += "  (SELECT * FROM operational_triggers "
    query += "  WHERE site_id = %s" %site_id
    query += "  AND ts_updated >= '%s' AND ts <= '%s' "%(start_monitor, end)
    query += "  ) AS op "
    query += "INNER JOIN "
    query += "  operational_trigger_symbols AS sym "
    query += "ON op.trigger_sym_id = sym.id "
    query += "ORDER BY ts DESC"
    op_trigger = qdb.get_db_dataframe(query)
    
    return op_trigger


def nd_internal_alert(no_data, internal_df, internal_symbols):
    """Internal alert sysmbol for event triggers that currently has no data.

    Args:
        no_data (dataframe): Event triggers that currently has no data.
        internal_df (dataframe): Event triggers.
        internal_symbols (dataframe): Internal alert symbols and id
                                      corresponding to its alert level.

    Returns:
        dataframe: event triggers with its corresponding internal alert symbol.
    """

    source_id = no_data['source_id'].values[0]
    alert_level = no_data['alert_level'].values[0]
    
    max_alert_level = max(internal_symbols[internal_symbols.source_id == \
                                           source_id]['alert_level'].values)

    if alert_level < max_alert_level:
        lower_symbol = internal_df[internal_df.source_id == source_id]['alert_symbol'].values[0].lower()
        internal_df.loc[internal_df.source_id == source_id, 'alert_symbol'] = lower_symbol

    return internal_df


def get_internal_alert(pos_trig, release_op_trig, internal_symbols):
    """Current internal alert sysmbol: indicates event triggers and operational
    trigger data presence.

    Args:
        pos_trig (dataframe): Operational triggers with alert level > 0.
        release_op_trigger (dataframe): Operational triggers after previous
                                        release until public alert timestamp.
        internal_symbols (dataframe): Internal alert symbols and id
                                      corresponding to its alert level.

    Returns:
        dataframe: alert symbol indicating event triggers and data presence.
    """
    highest_triggers = pos_trig.sort_values('alert_level',
                        ascending=False).drop_duplicates('source_id')
    with_data = release_op_trig[release_op_trig.alert_level != -1]
    with_data_id = with_data['source_id'].values
    with_data = highest_triggers[highest_triggers.source_id.isin(with_data_id)]

    # SPECIAL CASE FOR ON-DEMAND ALERTS
    on_demand_id = internal_symbols[internal_symbols.trigger_source == \
            'on demand']['trigger_sym_id'].values[0]
    check_for_on_demand = highest_triggers[highest_triggers["trigger_sym_id"] \
                                           == on_demand_id]

    if len(check_for_on_demand) != 0:
        with_data = with_data.append(check_for_on_demand)

    # SPECIAL CASE FOR EARTHQUAKE ALERTS
    earthquake_id = internal_symbols[internal_symbols.trigger_source == \
            'earthquake']['trigger_sym_id'].values[0]
    check_for_earthquake = highest_triggers[highest_triggers["trigger_sym_id"] \
                                           == earthquake_id]
    if len(check_for_earthquake) != 0:
        with_data = with_data.append(check_for_earthquake)
    
    sym_id = with_data['trigger_sym_id'].values
    no_data = highest_triggers[highest_triggers.source_id.isin(with_data_id)]
    nd_source_id = no_data['source_id'].values
    internal_df = internal_symbols[(internal_symbols.trigger_sym_id.isin(sym_id)) \
            | ((internal_symbols.source_id.isin(nd_source_id)) & \
               (internal_symbols.alert_level == -1))]

    # REPLACE NO DATA TRIGGERS
    if len(no_data) != 0:
        no_data_grp = no_data.groupby('source_id', as_index=False)
        internal_df = no_data_grp.apply(nd_internal_alert,
                                        internal_df=internal_df,
                                        internal_symbols=internal_symbols)
    
    # NOTE: LOUIE CHANGES FILTERS ON NO DATA. PACHECK KAY MERYLL
    internal_df = internal_df.drop_duplicates(subset = 'source_id', keep = 'last')
    internal_df = internal_df.reset_index(drop=True)

    return internal_df

def get_tsm_alert(site_id, end):
    """Dataframe containing alert level on each tsm sensor
    Args:
        site_id (dataframe): ID each site.
        end (datetime): Public alert timestamp.
    Returns:
        dataframe: Contains tsm name, alert level, and alert symbol
                   for current release
    """

    query =  "SELECT tsm_name, sub.alert_level FROM "
    query += "  (SELECT tsm_name, alert_level FROM "
    query += "    (SELECT * FROM tsm_alerts "
    query += "     WHERE ts <= '%s' " %end
    query += "    AND ts_updated >= '%s' " %(end - timedelta(hours=0.5))
    query += "    ORDER BY ts DESC "
    query += "    ) AS alert "
    query += "  INNER JOIN "
    query += "    (SELECT id as tsm_id, tsm_name FROM tsm_sensors "
    query += "    WHERE site_id = %s " %site_id
    query += "    ) AS tsm "
    query += "  ON tsm.tsm_id = alert.tsm_id) "
    query += "  AS sub "
    query += "INNER JOIN "
    query += "  (SELECT sym.source_id, alert_symbol, alert_level FROM "
    query += "    (SELECT source_id, alert_level, alert_symbol FROM "
    query += "    operational_trigger_symbols "
    query += "    ) AS sym "
    query += "  INNER JOIN "
    query += "    (SELECT id as source_id FROM trigger_hierarchies "
    query += "    WHERE trigger_source = 'subsurface' "
    query += "    ) AS hier "
    query += "  ON hier.source_id = sym.source_id "
    query += "  ) AS sub2 "
    query += "ON sub.alert_level = sub2.alert_level"

    subsurface = qdb.get_db_dataframe(query)
    subsurface = subsurface.drop_duplicates('tsm_name')
    
    return subsurface

def replace_rainfall_alert_if_rx(internal_df, internal_symbols, site_id,
                         end, rainfall_id, rain75_id):
    """Current internal alert sysmbol: includes rainfall symbol if 
    above 75% of threshold

    Args:
        internal_df (dataframe): Current internal alert level and sysmbol.
        internal_symbols (dataframe): Internal alert symbols and id
                                      corresponding to its alert level.
        site_id (dataframe): ID each site.
        end (datetime): Public alert timestamp.
        rainfall_id (int): id of rainfall operational trigger

    Returns:
        dataframe: alert symbol indicating event triggers, data presence 
                   and status of rainfall.
    """ 
    
    query =  "SELECT * FROM rainfall_alerts "
    query += "where site_id = '%s' " %site_id
    query += "and ts = '%s'" %end
    rainfall_df = qdb.get_db_dataframe(query)

    is_x = False
    if len(rainfall_df) != 0:
        is_x = True
        
        if rainfall_id in internal_df['source_id'].values:
            rain_alert = internal_symbols[internal_symbols.trigger_sym_id == \
                                        rain75_id]['alert_symbol'].values[0]
            trigger_sym_id = internal_symbols[internal_symbols.trigger_sym_id == \
                                        rain75_id]['trigger_sym_id'].values[0]
            internal_df.loc[internal_df.source_id == rainfall_id,
                            'alert_symbol'] = rain_alert
            internal_df.loc[internal_df.source_id == rainfall_id,
                            'trigger_sym_id'] = trigger_sym_id
        else:
            rain_df = internal_symbols[internal_symbols.trigger_sym_id == \
                                        rain75_id]
            rain_df['alert_symbol'] = rain_df['alert_symbol'].apply(lambda x: \
                                                                    x.lower())
            internal_df = internal_df.append(rain_df, ignore_index=True)
            
    return internal_df, is_x

def query_current_events(end):
    query = "SELECT PA.ts, PA.ts_updated, PA.site_id, PAS.alert_symbol FROM public_alerts as PA "
    query += "  JOIN public_alert_symbols as PAS "
    query += "    ON PA.pub_sym_id = PAS.id "
    query += "    WHERE PAS.alert_level > 0 "
    query += "    AND ts_updated >= '%s' " %end
    query += "    ORDER BY ts DESC "
    events = qdb.get_db_dataframe(query)
    current_events = events.groupby('site_id', as_index=False)
    
    return current_events

def get_alert_history(current_events):
    site_id = current_events['site_id'].values[0]
    start_ts = current_events['ts'].values[0]
    public_alert_symbols = current_events['alert_symbol'].values[0]
    
    query = "SELECT CONCAT(cdb.firstname, ' ', cdb.lastname) as iomp, " 
    query += "sites.site_code, OTS.alert_symbol, ALS.ts_last_retrigger, OTS.alert_level, " 
    query += "ALS.remarks, TH.trigger_source, ALS.alert_status, PAS.alert_symbol as public_alert_symbol, ALS.trigger_id as trigger_id "
    query += "FROM alert_status as ALS "
    query += "  JOIN operational_triggers as OT "
    query += "    ON ALS.trigger_id = OT.id "
    query += "      JOIN cbewsl_commons_db.sites "
    query += "      ON sites.id = OT.site_id " 
    query += "      JOIN operational_trigger_symbols as OTS "
    query += "      ON OT.trigger_sym_id = OTS.id " 
    query += "      JOIN trigger_hierarchies as TH "
    query += "      ON OTS.source_id = TH.id "
    query += "      JOIN cbewsl_commons_db.user_profiles as cdb "
    query += "      ON ALS.user_id = cdb.id "
    query += "      JOIN public_alerts as PA"
    query += "      ON PA.site_id = OT.site_id"
    query += "      JOIN public_alert_symbols as PAS "
    query += "      ON PA.pub_sym_id = PAS.id "
    query += "WHERE OT.site_id = '%s' " %site_id
    query += "AND OT.ts >= '%s' " %start_ts
    query += "AND PAS.alert_symbol = '%s' " %public_alert_symbols
    query += "ORDER BY OT.ts DESC"
    
    current_events_history = qdb.get_db_dataframe(query)
    
    return current_events_history

def get_site_dynamic_variables(site_id):
    query = "SELECT * FROM cbewsl_commons_db.dynamic_variables WHERE "
    query = f"{query} fk_site_id={site_id}"
    dynamic_variables = qdb.get_db_dataframe(query)

    return dynamic_variables

def site_public_alert(site_props, end, public_symbols, internal_symbols,
                      start_time):  
    """Dataframe containing necessary information for public release.

    Args:
        site_props (dataframe): ID and three-letter code of each site.
        end (datetime): Public alert timestamp.
        public_symbols (dataframe): Public alert symbols and id corresponding
                                    to its alert level.
        internal_symbols (dataframe): Internal alert symbols and id
                                      corresponding to its alert level.

    Returns:
        dataframe: Contains timestamp, three-letter site code, public alert, 
                   internal alert, validity of alert, subsurface alert, 
                   surficial alert, rainfall alert, most recent timestamp of
                   alert > 0 (if any) per alert level per operational trigger.
    """
    
    # id and three-letter code per site
    site_code = site_props['site_code'].values[0]
    site_id = site_props['site_id'].values[0]

    print(f"Site Code: {site_code.upper()}")

    # Creates a public_alerts table if it doesn't exist yet
    if qdb.does_table_exist('public_alerts') == False:
        qdb.create_public_alerts()
    
    # start of monitoring: start of event or 24 hours from "end"
    try:
        monitoring_type = get_monitoring_type(site_id, end)
    except:
        monitoring_type = 'routine'

    if monitoring_type == 'event':
        start_monitor = event_start(site_id, end)
    else:
        start_monitor = end - timedelta(1)

    # operational triggers for monitoring at timestamp end
    print("MON_TYPE: ", monitoring_type)
    print("START: ", start_monitor)
    print("END: ", end)
    op_trig = get_operational_trigger(site_id, start_monitor, end)

    # NOTE: Retrieves CBEWS-L dynamic variables
    site_dynamic_vars = get_site_dynamic_variables(site_id)

    rel_interval_hour = int(site_dynamic_vars['release_interval_hours'][0])
    release_op_trig = op_trig[op_trig.ts_updated <= \
            # release_time(end)-timedelta(hours=4)]
            release_time(end)-timedelta(hours=rel_interval_hour)]
    release_op_trig = release_op_trig.drop_duplicates(['source_id', \
            'alert_level'])
    subsurface_id = internal_symbols[internal_symbols.trigger_source == \
            'subsurface']['source_id'].values[0]
    surficial_id = internal_symbols[internal_symbols.trigger_source == \
            'surficial']['source_id'].values[0]
    moms_id = internal_symbols[internal_symbols.trigger_source == \
            'moms']['source_id'].values[0]

    release_op_trig = release_op_trig[~((release_op_trig.source_id \
            == subsurface_id) & (release_op_trig.ts_updated < end))]
    pos_trig = op_trig[(op_trig.alert_level > 0) & ~((op_trig.alert_level == 1) \
                        & (op_trig.source_id == surficial_id))]
    last_pos_trig = pos_trig.drop_duplicates(['source_id', \
            'alert_level'])

    # Obtain public alert based on highest alert level in operational triggers
    public_alert = max(list(pos_trig['alert_level'].values) + [0])
    print('Public Alert: %s' %public_alert)   
    print()

    # SUBSURFACE ALERT
    subsurface = get_tsm_alert(site_id, end)

    # SURFICIAL ALERT
    if public_alert > 0:
        surficial_ts = release_time(end) - timedelta(hours=rel_interval_hour, minutes=30)
    else:
        surficial_ts = pd.to_datetime(end.date())

    try:
        surficial = op_trig[(op_trig.source_id == surficial_id) & \
            (op_trig.ts_updated >= surficial_ts)]['alert_level'].values[0]
    except:
        surficial = -1

    # MOMS ALERT
    if public_alert > 0:
        moms_ts = release_time(end) - timedelta(hours=rel_interval_hour)
    else:
        moms_ts = pd.to_datetime(end.date())
    
    try:
        moms_alert = op_trig[(op_trig.source_id == moms_id) & \
                 (op_trig.ts_updated >= moms_ts)]['alert_level'].values[0]
    except:
        moms_alert = -1

    # Get MOMS from database sorted by obs_ts and highest alert level
    sorted_ma_df, moms_alert_level = get_site_moms_alerts(
                                        site_id=site_id,
                                        start=moms_ts,
                                        end=release_time(end))
    unresolved_moms_df, has_unresolved_moms = check_if_has_unresolved_moms_instance(sorted_ma_df)

    # RAINFALL ALERT
    rainfall_id = internal_symbols[internal_symbols.trigger_source == \
            'rainfall']['source_id'].values[0]
    try:
        rainfall = op_trig[(op_trig.source_id == rainfall_id) & \
                           (op_trig.ts_updated >= end - \
                            timedelta(hours=0.5))]['alert_level'].values[0]
    except:
        rainfall = -1
    
    # INTERNAL ALERT
    internal_id = internal_symbols[internal_symbols.trigger_source == \
            'internal']['source_id'].values[0]

    if public_alert > 0:
        # validity of alert
        validity = pd.to_datetime(max(pos_trig['ts_updated'].values)) \
                                 + timedelta(1)
        validity = release_time(validity)
        
        if public_alert == 3:
            validity += timedelta(1)

        # internal alert based on positive triggers and data presence
        internal_df = get_internal_alert(pos_trig, release_op_trig,       
                                  internal_symbols)

        # check if rainfall > 75% of threshold
        rain75_id = internal_symbols[(internal_symbols.source_id == \
                        rainfall_id)&(internal_symbols.alert_level \
                        == -2)]['trigger_sym_id'].values[0]
        
        if rainfall == 0 and end >= validity - timedelta(hours=0.5):
            internal_df, is_x = replace_rainfall_alert_if_rx(internal_df, internal_symbols,
                                               site_id, end, rainfall_id,
                                               rain75_id)
            
            if is_x == True:
                rainfall = -2

        internal_df = internal_df.sort_values('hierarchy_id')
        internal_alert = ''.join(internal_df['alert_symbol'].values)

        if public_alert > 1:
            internal_alert = public_symbols[public_symbols.alert_level == \
                             public_alert]['alert_symbol'].values[0] + '-' + \
                             internal_alert

    # ground data presence: subsurface, surficial, moms
    if public_alert <= 1:
        # if surficial == -1 and len(subsurface[subsurface.alert_level != -1]) == 0:
        # NOTE: LOUIE - trial code to include moms
        if surficial == -1 and moms_alert == -1 and len(subsurface[subsurface.alert_level != -1]) == 0:
            ground_alert = -1
        else:
            ground_alert = 0

        if public_alert == 0 or ground_alert == -1:
            pub_internal = internal_symbols[(internal_symbols.alert_level == \
                             ground_alert) & (internal_symbols.source_id == \
                             internal_id)]['alert_symbol'].values[0]
            if public_alert == 0:
                internal_alert = ''
                hyphen = ''
            else:
                hyphen = '-'
        else:
            pub_internal = public_symbols[public_symbols.alert_level == \
                             public_alert]['alert_symbol'].values[0]
            hyphen = '-'
        internal_alert = pub_internal + hyphen + internal_alert
    elif -1 in internal_df[internal_df.trigger_source != 'rainfall']['alert_level'].values:
        ground_alert = -1
    else:
        ground_alert = 0

    if has_unresolved_moms:
        ground_alert = -1

    # PUBLIC ALERT
    # check if end of validity: lower alert if with data and not rain75
    is_within_alert_extension = False
    if public_alert > 0:
        is_release_time_run = end.time() in [time(3, 30), time(7, 30),
                        time(11, 30), time(15, 30), time(19, 30),
                        time(23, 30)]
        is_45_minute_beyond = int(start_time.strftime('%M')) > 45
        is_not_yet_write_time = not (is_release_time_run and is_45_minute_beyond)
        is_within_alert_extension = validity + timedelta(3) > end + timedelta(hours=0.5)
        has_no_ground_data = ground_alert == -1

        # check if end of validity: lower alert if with data and not rain75
        if validity > end + timedelta(hours=0.5):
            pass
        elif rain75_id in internal_df['trigger_sym_id'].values \
                or (is_within_alert_extension and has_no_ground_data) \
                    or is_not_yet_write_time:
                    # or is_not_yet_write_time \
                    #     or is_within_alert_extension and has_unresolved_moms:

            validity = release_time(end)
        
            if is_release_time_run:
                if not(is_45_minute_beyond):
                    do_not_write_to_db = True
        else:
                validity = ''
                public_alert = 0
                internal_alert = internal_symbols[(internal_symbols.alert_level == \
                                ground_alert) & (internal_symbols.source_id == \
                                internal_id)]['alert_symbol'].values[0]
    else:
        validity = ''
        public_alert = 0
        has_no_ground_data = ground_alert == -1
        internal_alert = internal_symbols[(internal_symbols.alert_level == \
                         ground_alert) & (internal_symbols.source_id == \
                         internal_id)]['alert_symbol'].values[0]


    # GROUND DATA LAST RECEIVED TIMESTAMP (for ND)
    ts_last_ground_data = datetime.strptime(get_ground_data_last_ts(site_id=site_id).ts[0], "%Y-%m-%d %H:%M:%S")
    # if validity:
    #     ts_since_last_ground_data = (validity - ts_last_ground_data).days
    #     # validity = validity + timedelta(hours=4)
    # else:
    #     ts_since_last_ground_data = -1
    ts_since_last_ground_data = (datetime.now() - ts_last_ground_data).days
    
    # start of event
    if monitoring_type != 'event' and len(pos_trig) != 0:
        ts_onset = min(pos_trig['ts'].values)
        ts_onset = pd.to_datetime(ts_onset)
    
    # most recent retrigger of positive operational triggers
    try:
        #last positive retriggger/s
        triggers = last_pos_trig[['trigger_id', 'alert_symbol', 'ts_updated', 'trigger_sym_id', 'source_id', 'alert_level']]
        triggers = triggers.rename(columns = {'alert_symbol': 'alert', \
                'ts_updated': 'ts'})
        triggers['ts'] = triggers['ts'].apply(lambda x: str(x))
    except:
        triggers = pd.DataFrame(columns=['trigger_id', 'alert', 'ts', 'trigger_sym_id', 'source_id', 'alert_level'])
     
    #technical info for bulletin release
    try:
        #tech_info = pd.DataFrame(columns=['subsurface', 'surficial', 'rainfall', \
        #  'earthquake', 'on demand'])
        pos_trig = pd.merge(pos_trig, internal_symbols, on='trigger_sym_id')

        tech_info = tech_info_maker.main(pos_trig)
    except:
        tech_info = pd.DataFrame()

    try:    
        ts = max(op_trig[op_trig.alert_level != -1]['ts_updated'].values)
        ts = round_data_ts(pd.to_datetime(ts))
    except:
        ts = end
        
    if ts > end or (int(start_time.strftime('%M')) >= 45 \
                    or int(start_time.strftime('%M')) >= 15
                    and int(start_time.strftime('%M')) < 30) and ts != end:
        ts = end

    ts = str(ts)    
    validity = str(validity)

    public_df = pd.DataFrame({'ts': [ts], 'site_id': [site_id],
                    'site_code': [site_code], 'public_alert': [public_alert],
                    'internal_alert': [internal_alert], 'validity': [validity],
                    'subsurface': [subsurface], 'surficial': [surficial],
                    'rainfall': [rainfall], 'moms': [moms_alert],
                    'triggers': [triggers], 'tech_info': [tech_info],
                    'has_no_ground_data': [has_no_ground_data],
                    'ts_since_last_ground_data' : [ts_since_last_ground_data],
                    'is_within_alert_extension': [is_within_alert_extension],
                    'has_unresolved_moms': [has_unresolved_moms]})

    # writes public alert to database
    pub_sym_id =  public_symbols[public_symbols.alert_level == \
                  public_alert]['pub_sym_id'].values[0]
    site_public_df = pd.DataFrame({'ts': [end], 'site_id': [site_id], \
            'pub_sym_id': [pub_sym_id], 'ts_updated': [end]})
    
    # onset trigger
    try:
        site_public_df['ts'] = round_data_ts(ts_onset)
    except:
        pass
    
    try:
        do_not_write_to_db
    except:
        print()
        qdb.alert_to_db(site_public_df, 'public_alerts')
    
    return public_df


def alert_map(df):
    dict_map = df[['alert_symbol', 'alert_level']]
    dict_map = dict_map.set_index('alert_level').to_dict()['alert_symbol']
    return dict_map

def subsurface_sym(df, sym_map):
    if len(df['subsurface'].values[0]) != 0:
        try:
            int(df['subsurface'].values[0]['alert_level'].values[0])
            df['subsurface'].values[0]['alert_level'] = \
                  df['subsurface'].values[0]['alert_level'].map(sym_map)
        except:
            pass
    return df

def main(end=datetime.now()):
    """Compiles all alerts to compute for public alert and internal alert.
    Writes result to public_alert table and publicalert.json

    Args:
        end (datetime): Optional. Public alert timestamp.
    """
    start_time = datetime.now()
    print("Running publicalerts.py @", start_time)
    # qdb.print_out(start_time)

    end = round_data_ts(pd.to_datetime(end))
    
    # alert symbols
    # public alert
    public_symbols = get_public_symbols()
    pub_map = alert_map(public_symbols)
    # internal alert symbols
    internal_symbols = get_internal_symbols()
    # operational triggers symbols
    trig_symbols = get_trigger_symbols()
    # subsurface alert
    subsurface_map = trig_symbols[trig_symbols.trigger_source == 'subsurface']
    subsurface_map = alert_map(subsurface_map)
    # surficial alert
    surficial_map = trig_symbols[trig_symbols.trigger_source == 'surficial']
    surficial_map = alert_map(surficial_map)
    # Manifestation Of Movement
    moms_map = trig_symbols[trig_symbols.trigger_source == 'moms']
    moms_map = alert_map(moms_map)
    # rainfall alert
    rain_map = trig_symbols[trig_symbols.trigger_source == 'rainfall']
    rain_map = alert_map(rain_map)
    
    # site id and code
    query = "SELECT id as site_id, site_code FROM cbewsl_commons_db.sites WHERE active = 1"
    props = qdb.get_db_dataframe(query)
    site_props = props.groupby('site_id', as_index=False)
    alerts = site_props.apply(site_public_alert, end=end,
                              public_symbols=public_symbols,
                              internal_symbols=internal_symbols, 
                              start_time=start_time).reset_index(drop=True)

    alerts = alerts.sort_values(['public_alert', 'site_code'], ascending=[False, True])

    # map alert level to alert symbol
    alerts['public_alert'] = alerts['public_alert'].map(pub_map)
    alerts['rainfall'] = alerts['rainfall'].map(rain_map)
    alerts['surficial'] = alerts['surficial'].map(surficial_map)
    alerts['moms'] = alerts['moms'].map(moms_map)
    site_alerts = alerts.groupby('site_code', as_index=False)
    alerts = site_alerts.apply(subsurface_sym,
                               sym_map=subsurface_map).reset_index(drop=True)
    # map invalid alerts
    current_events = query_current_events(end)
    current_alerts = current_events.apply(get_alert_history)
    columns = ['iomp', 'site_code', 'alert_symbol', 'ts_last_retrigger', 'alert_level', 'remarks', 'trigger_source', 'alert_status', 'public_alert_symbol', 'trigger_id']
    invalid_alerts = pd.DataFrame(columns=columns)
    try:
        for site in current_alerts.site_code.unique():
            site_df = current_alerts[current_alerts.site_code == site]
            count = len(site_df)
            for i in range(0, count):
                if site_df.alert_status.values[i] == -1:
                    alert = pd.Series(site_df.values[i], index=columns)
                    invalid_alerts = invalid_alerts.append(alert, ignore_index=True)
                else:
                    invalid_alerts = invalid_alerts
                    
        invalid_alerts = invalid_alerts.drop_duplicates(['alert_symbol', 'site_code'])
        invalid_alerts['ts_last_retrigger'] = invalid_alerts['ts_last_retrigger'].apply(lambda x: str(x))

    except AttributeError as att_err:
        print("Empty dataframe")
        invalid_alerts = pd.DataFrame()
    except Exception as err:
        raise(err)

    all_alerts = pd.DataFrame({'invalids': [invalid_alerts], 'alerts': [alerts]})

    public_json = all_alerts.to_json(orient="records")

    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    sc = qdb.memcached()

    # LOUIE
    if not os.path.exists(output_path+sc['fileio']['output_path']):
        os.makedirs(output_path+sc['fileio']['output_path'])

    with open(output_path+sc['fileio']['output_path']+'PublicAlertRefDB.json', 'w') as w:
        w.write(public_json)

    # LOUIE
    print(f"PublicAlertRefDB.json written at {output_path+sc['fileio']['output_path']}")
    print('runtime = %s' %(datetime.now() - start_time))
    print("Done runnning publicalerts.py @", datetime.now())
    print()
    
    return alerts

################################################################################

if __name__ == "__main__":
    df = main()
#    df = main("2018-11-17 15:30:00")
