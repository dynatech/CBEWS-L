import AppConfig from './src/utils/AppConfig';

import {
  AuthRegistration,
  UserAuthentication,
} from "./src/UserManagement/Auth";

// MAR
import {
  UploadCommunityRiskAssessment,
  GetCommunityRiskAssessment,
  DownloadCommunityRiskAssessmentFile,
  DeleteCommunityRiskAssessment,
} from "./src/MAR/CommunityRiskAssessment/CommunityRiskAssessment";
import {
  GetAllCapacityAndVulnerability,
  GetOneCapacityAndVulnerability,
  InsertCapacityAndVulnerability,
  UpdateCapacityAndVulnerability,
  DeleteCapacityAndVulnerability,
} from "./src/MAR/CommunityRiskAssessment/CapacityAndVulnerability";
import {
  GetHazardMaps,
  UploadHazardMaps,
} from "./src/MAR/CommunityRiskAssessment/HazardMaps";
import {
  InsertEventsTemplate,
  UpdateEventsTemplate,
  GetAllEventsTemplate,
  DeleteEventsTemplate,
} from "./src/MAR/EventsTemplate/EventsTemplate";
import {
  GetIncidentLogs,
  GetDayIncidentLogs,
  GetMonthIncidentLogs,
  InsertIncidentLogs,
  UpdateIncidentLogs,
  DeleteIncidentLogs,
  UploadReportAttachment,
} from "./src/MAR/MaintenanceLogs/IncidentLogs";
import {
  GetMaintenanceLogs,
  GetDayMaintenanceLogs,
  GetMonthMaintenanceLogs,
  InsertMaintenanceLogs,
  UpdateMaintenanceLogs,
  DeleteMaintenanceLogs,
  FetchLogAttachments,
  SendPDFReportViaEmail,
} from "./src/MAR/MaintenanceLogs/MaintenanceLogs";
import {
    GetSurficialMarkersData,
    UpdateSurficialMarkerData,
    InsertSurficialMarkersData,
    DeleteSurficialMarkersData
} from "./src/MAR/GroundData/SurficialMarkers";
import {
    FetchMoMSFeatures,
    FetchOneMoMSFeatures,
    GetMomsInstancesPerType,
    GetMomsInstancesPerSite,
    GetMOMSData,
    UpdateMOMSData,
    InsertMOMSData,
    DeleteMOMSData,
    InsertMomsFeatureType,
    InsertMomsInstance,
    UpdateMomsFeatureType,
    UpdateMomsInstance,
    DeleteMomsFeatureType,
    DeleteMomsInstance,
    FetchMOMSAnalysis,
} from "./src/MAR/GroundData/MOMS";
import {
    GetOnDemandData,
    RaiseOnDemandAlert,
    InsertOnDemandData,
} from "./src/MAR/GroundData/OnDemand";
import {
  GetRainfallPlotData,
  GetRainfallAnalysis,
} from "./src/MAR/DataAnalysis/RainfallAnalysis";
import {
  GetSurficialPlotData,
  GetSurficialPlotAnalysis
} from "./src/MAR/DataAnalysis/SurficialAnalysis";
import {
  GetSubsurfacePlotData
} from "./src/MAR/DataAnalysis/SubsurfaceAnalysis";
import {
  GetEarthquakeData,
} from "./src/MAR/SensorData";

// UMI
import {
  GetAllSummary,
  InsertSummary,
  UpdateSummary,
  DeleteSummary,
} from "./src/UMI/RiskAssessment/Summary";
import {
  GetAllHazardData,
  InsertHazardData,
  UpdateHazardData,
  DeleteHazardData,
} from "./src/UMI/RiskAssessment/HazardData";
import {
  GetAllResourceAndCapacities,
  InsertResourceAndCapacities,
  UpdateResourceAndCapacities,
  DeleteResourceAndCapacities,
} from "./src/UMI/RiskAssessment/ResourceAndCapacities";
import {
  GetAllFamilyRiskProfile,
  InsertFamilyRiskProfile,
  UpdateFamilyRiskProfile,
  DeleteFamilyRiskProfile,
} from "./src/UMI/RiskAssessment/FamilyRiskProfile";
import {
  GetHazardMaps as UmiGetHazardMaps,
  UploadHazardMaps as UmiUploadHazardMaps,
} from "./src/UMI/RiskAssessment/HazardMaps";
import {
  GetFieldSurveyLogs,
  InsertFieldSurveyLogs,
  UpdateFieldSurveyLogs,
  DeleteFieldSurveyLogs,
  UpdateAttachmentFile,
} from "./src/UMI/FieldSurvey/FieldSurveyLogs";
import {
  GetLatestReportSummary,
  DownloadLatestReportSummary,
  EmailLatestReportSummary,
} from "./src/UMI/FieldSurvey/ReportSummary";
import { GetReportsByRange } from './src/UMI/Reports/ReportManager';
import {
  GetCurrentSituationReport,
  DownloadSituationReport,
  EmailSituationReport,
} from "./src/UMI/SituationReport/CurrentSituationReport";
import {
  GetSituationReport,
  InsertSituationReport,
  UpdateSituationReport,
  DeleteSituationReport,
  UploadSituationReport,
  UpdateSituationReportAttachmentFile,
} from "./src/UMI/SituationReport/SituationReport";

import {
  GetMOMSData as UMIGetMOMSData,
  UpdateMOMSData as UMIUpdateMOMSData,
  InsertMOMSData as UMIInsertMOMSData,
  DeleteMOMSData as UMIDeleteMOMSData,
} from "./src/UMI/GroundData/MOMS";

import {
  GetSurficialMarkersData as UMIGetSurficialMarkersData,
  UpdateSurficialMarkerData as UMIUpdateSurficialMarkerData,
  InsertSurficialMarkersData as UMIInsertSurficialMarkersData,
  DeleteSurficialMarkersData as UMIDeleteSurficialMarkersData,
} from "./src/UMI/GroundData/SurficialData";

import {
  GetRainfallPlotData as UMIGetRainfallPlotData
} from "./src/UMI/DataAnalysis/RainfallAnalysis";
import {
  GetSurficialPlotData as UMIGetSurficialPlotData
} from "./src/UMI/DataAnalysis/SurficialAnalysis";
import {
  GetSubsurfacePlotData as UMIGetSubsurfacePlotData
} from "./src/UMI/DataAnalysis/SubsurfaceAnalysis";
import {
  GetSensorMaintenanceLogs,
  GetDaySensorMaintenanceLogs,
  GetMonthSensorMaintenanceLogs,
  InsertSensorMaintenanceLogs,
  UpdateSensorMaintenanceLogs,
  DeleteSensorMaintenanceLogs,
} from "./src/UMI/SensorMaintenance/SensorMaintenance";

import { GetOngoingAndExtendedMonitoring } from "./src/AlertGeneration/PublicAlerts";
import { RenderPDF, DownloadPDF } from "./src/MAR/FileManager/PDFManager";

const UserManagement = {
  AuthRegistration,
  UserAuthentication,
};

const AlertGeneration = {
  GetOngoingAndExtendedMonitoring,
};

const MarDataAnalysis = {
  GetRainfallPlotData,
  GetRainfallAnalysis,
  GetSurficialPlotData,
  GetSurficialPlotAnalysis,
  GetSubsurfacePlotData,
};

const MarGroundData = {
    GetSurficialMarkersData,
    UpdateSurficialMarkerData,
    InsertSurficialMarkersData,
    DeleteSurficialMarkersData,
    FetchMoMSFeatures,
    FetchOneMoMSFeatures,
    GetMomsInstancesPerType,
    GetMomsInstancesPerSite,
    GetMOMSData,
    UpdateMOMSData,
    InsertMOMSData,
    DeleteMOMSData,
    GetOnDemandData,
    RaiseOnDemandAlert,
    InsertOnDemandData,
    InsertMomsFeatureType,
    InsertMomsInstance,
    UpdateMomsFeatureType,
    UpdateMomsInstance,
    DeleteMomsFeatureType,
    DeleteMomsInstance,
    FetchMOMSAnalysis,
};

const MarCommunityRiskAssessment = {
  UploadCommunityRiskAssessment,
  GetCommunityRiskAssessment,
  DownloadCommunityRiskAssessmentFile,
  DeleteCommunityRiskAssessment,
  InsertCapacityAndVulnerability,
  UpdateCapacityAndVulnerability,
  GetAllCapacityAndVulnerability,
  GetOneCapacityAndVulnerability,
  DeleteCapacityAndVulnerability,
  GetHazardMaps,
  UploadHazardMaps,
};

const MarMaintenanceLogs = {
  GetIncidentLogs,
  GetDayIncidentLogs,
  GetMonthIncidentLogs,
  InsertIncidentLogs,
  UpdateIncidentLogs,
  DeleteIncidentLogs,
  UploadReportAttachment,
  GetMaintenanceLogs,
  GetDayMaintenanceLogs,
  GetMonthMaintenanceLogs,
  InsertMaintenanceLogs,
  UpdateMaintenanceLogs,
  DeleteMaintenanceLogs,
  FetchLogAttachments,
  RenderPDF,
  DownloadPDF,
  SendPDFReportViaEmail,
};

const MarSensorData = {
  GetEarthquakeData,
}

const UmiRiskManagement = {
  GetAllSummary,
  InsertSummary,
  UpdateSummary,
  DeleteSummary,
  GetAllHazardData,
  InsertHazardData,
  UpdateHazardData,
  DeleteHazardData,
  GetAllResourceAndCapacities,
  InsertResourceAndCapacities,
  UpdateResourceAndCapacities,
  DeleteResourceAndCapacities,
  GetAllFamilyRiskProfile,
  InsertFamilyRiskProfile,
  UpdateFamilyRiskProfile,
  DeleteFamilyRiskProfile,
  GetHazardMaps: UmiGetHazardMaps,
  UploadHazardMaps: UmiUploadHazardMaps,
};

const UmiFieldSurvey = {
  GetFieldSurveyLogs,
  InsertFieldSurveyLogs,
  UpdateFieldSurveyLogs,
  DeleteFieldSurveyLogs,
  GetLatestReportSummary,
  UpdateAttachmentFile,
  DownloadLatestReportSummary,
  EmailLatestReportSummary,
};

const MarEventsTemplate = {
  InsertEventsTemplate,
  UpdateEventsTemplate,
  GetAllEventsTemplate,
  DeleteEventsTemplate,
};

const UmiSituationReport = {
  GetSituationReport,
  GetCurrentSituationReport,
  DownloadSituationReport,
  EmailSituationReport,
  UploadSituationReport,
  InsertSituationReport,
  UpdateSituationReport,
  DeleteSituationReport,
  UpdateSituationReportAttachmentFile,
};

const UmiReports = {
    GetReportsByRange
}

const UmiDataAnalysis = {
  GetRainfallPlotData: UMIGetRainfallPlotData,
  GetSurficialPlotData: UMIGetSurficialPlotData,
  GetSubsurfacePlotData: UMIGetSubsurfacePlotData,
};

const UmiGroundData = {
  GetMOMSData: UMIGetMOMSData,
  UpdateMOMSData: UMIUpdateMOMSData,
  InsertMOMSData: UMIInsertMOMSData,
  DeleteMOMSData: UMIDeleteMOMSData,
  GetSurficialMarkersData: UMIGetSurficialMarkersData,
  UpdateSurficialMarkerData: UMIUpdateSurficialMarkerData,
  InsertSurficialMarkersData: UMIInsertSurficialMarkersData,
  DeleteSurficialMarkersData: UMIDeleteSurficialMarkersData,
};

const UmiSensorMaintenance = {
  GetSensorMaintenanceLogs,
  GetDaySensorMaintenanceLogs,
  GetMonthSensorMaintenanceLogs,
  InsertSensorMaintenanceLogs,
  UpdateSensorMaintenanceLogs,
  DeleteSensorMaintenanceLogs,
}

export {
    AppConfig,
    AlertGeneration,
    UserManagement,
    MarCommunityRiskAssessment,
    MarMaintenanceLogs,
    MarEventsTemplate,
    MarGroundData,
    MarDataAnalysis,
    MarSensorData,
    UmiRiskManagement,
    UmiFieldSurvey,
    UmiSituationReport,
    UmiReports,
    UmiDataAnalysis,
    UmiGroundData,
    UmiSensorMaintenance,
}
