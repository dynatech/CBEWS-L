import AppConfig from './src/utils/AppConfig';

import {
  AuthRegistration,
  UserAuthentication,
} from "./src/UserManagement/Auth";

import {
  GetIloiloEarthquakeData,
} from "./src/merged/Earthquake";

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
  GetHazardMapsGallery,
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
  FetchReportAttachments,
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
  DeleteLogAttachment,
  UploadLogAttachments,
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
    FetchMOMSAttachments,
    UploadMOMSAttachment,
} from "./src/MAR/GroundData/MOMS";
import {
    GetOnDemandData,
    RaiseOnDemandAlert,
    InsertOnDemandData,
} from "./src/MAR/GroundData/OnDemand";
import {
  GetRainfallPlotData,
  GetRainfallPlotDataWithDays,
  GetRainfallAnalysis,
} from "./src/MAR/DataAnalysis/RainfallAnalysis";
import {
  GetSurficialPlotData,
  GetSurficialPlotAnalysis
} from "./src/MAR/DataAnalysis/SurficialAnalysis";
import {
  GetSubsurfacePlotData,
  GetSubsurfacePlotDataWithDays
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
import { 
  GetReportsByRange,
  GetAllFieldSurveyLogsByDate, 
  GetAllSituationReportsByDate,
} from './src/UMI/Reports/ReportManager';
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
  GetRainfallPlotData as UMIGetRainfallPlotData,
  GetRainfallPlotDataWithDays as UMIGetRainfallPlotDataWithDays
} from "./src/UMI/DataAnalysis/RainfallAnalysis";
import {
  GetSurficialPlotData as UMIGetSurficialPlotData
} from "./src/UMI/DataAnalysis/SurficialAnalysis";
import {
  GetSubsurfacePlotData as UMIGetSubsurfacePlotData,
  GetSubsurfacePlotDataWithDays as UMIGetSubsurfacePlotDataWithDays
} from "./src/UMI/DataAnalysis/SubsurfaceAnalysis";
import {
  GetSensorMaintenanceLogs,
  GetDaySensorMaintenanceLogs,
  GetMonthSensorMaintenanceLogs,
  InsertSensorMaintenanceLogs,
  UpdateSensorMaintenanceLogs,
  DeleteSensorMaintenanceLogs,
} from "./src/UMI/SensorMaintenance/SensorMaintenance";

import {
  UmiGetOngoingAndExtendedMonitoring,
  MarGetOngoingAndExtendedMonitoring,
  GetMarAlertValidationData,
  GetUmiAlertValidationData,
  InsertEWI,
  ValidateTrigger
} from "./src/AlertGeneration/PublicAlerts";
import { RenderPDF, DownloadPDF } from "./src/MAR/FileManager/PDFManager";

const UserManagement = {
  AuthRegistration,
  UserAuthentication,
};

const MergedData = {
  GetIloiloEarthquakeData,
}

const AlertGeneration = {
  UmiGetOngoingAndExtendedMonitoring,
  MarGetOngoingAndExtendedMonitoring,
  GetUmiAlertValidationData,
  GetMarAlertValidationData,
  InsertEWI,
  ValidateTrigger
};

const MarDataAnalysis = {
  GetRainfallPlotData,
  GetRainfallPlotDataWithDays,
  GetRainfallPlotDataWithDays,
  GetRainfallAnalysis,
  GetSurficialPlotData,
  GetSurficialPlotAnalysis,
  GetSubsurfacePlotData,
  GetSubsurfacePlotDataWithDays,
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
    FetchMOMSAttachments, 
    UploadMOMSAttachment,
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
  GetHazardMapsGallery,
  UploadHazardMaps,
};

const MarMaintenanceLogs = {
  GetIncidentLogs,
  GetDayIncidentLogs,
  GetMonthIncidentLogs,
  InsertIncidentLogs,
  UpdateIncidentLogs,
  DeleteIncidentLogs,
  FetchReportAttachments,
  UploadReportAttachment,
  GetMaintenanceLogs,
  GetDayMaintenanceLogs,
  GetMonthMaintenanceLogs,
  InsertMaintenanceLogs,
  UpdateMaintenanceLogs,
  DeleteMaintenanceLogs,
  FetchLogAttachments,
  DeleteLogAttachment,
  UploadLogAttachments,
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
    GetReportsByRange,
    GetAllFieldSurveyLogsByDate,
    GetAllSituationReportsByDate,
}

const UmiDataAnalysis = {
  GetRainfallPlotData: UMIGetRainfallPlotData,
  GetRainfallPlotDataWithDays: UMIGetRainfallPlotDataWithDays,
  GetSurficialPlotData: UMIGetSurficialPlotData,
  GetSubsurfacePlotData: UMIGetSubsurfacePlotData,
  GetSubsurfacePlotDataWithDays: UMIGetSubsurfacePlotDataWithDays
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
    MergedData,
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
