
"""
Contains server run configurations
"""


class Config(object):
    """
    Common configurations
    """
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    """
    Development configurations
    """

    DEBUG = True


class ProductionConfig(Config):
    """
    Production configurations
    """

    DEBUG = False

APP_DIR = "/home/dynaslope"

APP_CONFIG = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "url": "https://dynaslope.phivolcs.dost.gov.ph",
    "WEB_ASSETS_DIR": f"{APP_DIR}/CBEWS-L/packages/web/src/assets",
    "MARIRONG_DIR": f"{APP_DIR}/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG",
    "CRA_PATH": f"{APP_DIR}/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG/DOCUMENTS/",
    "MAPS_PATH": f"{APP_DIR}/CBEWS-L/packages/commons/src/client-cbewsl/MARIRONG/MAPS/",
    "UMINGAN_DIR": f"{APP_DIR}/CBEWS-L/packages/commons/src/client-cbewsl/UMINGAN",
    "CANDIDATE_DIR": f"{APP_DIR}/CBEWS-L/packages/server/Documents/monitoringoutput/alertgen",
    "public_alert_file": f"{APP_DIR}/CBEWS-L/packages/server/Documents/monitoringoutput/alertgen/PublicAlertRefDB.json",
    "site_code": {
        "29": "MARIRONG_DIR",
        "50": "UMINGAN_DIR"
    },
    "site_ids": {
        "mar": 29,
        "umi": 50
    },
    "sites_schema": "cbewsl_commons_db",
    "app_directory": APP_DIR
}
