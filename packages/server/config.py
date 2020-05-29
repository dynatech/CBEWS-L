
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


APP_CONFIG = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "url": "http://localhost:3000",
    # "MARIRONG_DIR": "/home/jgeliberte/codes/cbews-l-mar-fe/src/client-cbewsl/MARIRONG",
    # "UMINGAN_DIR": "/home/jgeliberte/codes/cbews-l-mar-fe/src/client-cbewsl/UMINGAN",
    "MARIRONG_DIR": "C:/Users/John Louie/codes/CBEWS-L/packages/web/client-cbewsl/MARIRONG",
    "UMINGAN_DIR": "C:/Users/John Louie/codes/CBEWS-L/packages/web/client-cbewsl/UMINGAN",
    "CANDIDATE_DIR": "/home/louie-cbews/CODES/cbews_iloilo/Documents/monitoringoutput/alertgen",
    "public_alert_file": "/home/louie-cbews/CODES/cbews_iloilo/Documents/monitoringoutput/alertgen/PublicAlertRefDB.json",
    "site_code": {
        "51": "MARIRONG_DIR",
        "50": "UMINGAN_DIR"
    }
}
