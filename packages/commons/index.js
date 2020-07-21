import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { UploadCommunityRiskAssessment, GetCommunityRiskAssessment } from './src/MAR/CommunityRiskAssessment/CommunityRiskAssessment';
import { GetAllCapacityAndVulnerability, GetOneCapacityAndVulnerability, InsertCapacityAndVulnerability, UpdateCapacityAndVulnerability, DeleteCapacityAndVulnerability } from './src/MAR/CommunityRiskAssessment/CapacityAndVulnerability';
import { GetHazardMaps, UploadHazardMaps, } from './src/MAR/CommunityRiskAssessment/HazardMaps';
import { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary } from './src/UMI/RiskAssessment/Summary';
import { GetAllHazardData, InsertHazardData, UpdateHazardData, DeleteHazardData } from './src/UMI/RiskAssessment/HazardData';
import { GetAllResourceAndCapacities, InsertResourceAndCapacities, UpdateResourceAndCapacities, DeleteResourceAndCapacities } from './src/UMI/RiskAssessment/ResourceAndCapacities';
import { GetAllFamilyRiskProfile, InsertFamilyRiskProfile, UpdateFamilyRiskProfile, DeleteFamilyRiskProfile } from './src/UMI/RiskAssessment/FamilyRiskProfile';
import { GetIncidentLogs, InsertIncidentLogs, UpdateIncidentLogs, DeleteIncidentLogs } from './src/MAR/MaintenanceLogs/IncidentLogs';
import { GetMaintenanceLogs, InsertMaintenanceLogs, UpdateMaintenanceLogs, DeleteMaintenanceLogs } from './src/MAR/MaintenanceLogs/MaintenanceLogs';
import { GetHazardMaps as UmiGetHazardMaps, UploadHazardMaps as UmiUploadHazardMaps } from './src/UMI/RiskAssessment/HazardMaps';
import { GetFieldSurveyLogs, InsertFieldSurveyLogs, UpdateFieldSurveyLogs, DeleteFieldSurveyLogs } from './src/UMI/FieldSurvey/FieldSurveyLogs';
import { GetLatestReportSummary, DownloadLatestReportSummary, EmailLatestReportSummary } from './src/UMI/FieldSurvey/ReportSummary';
import { InsertEventsTemplate, UpdateEventsTemplate, GetAllEventsTemplate, DeleteEventsTemplate } from './src/MAR/EventsTemplate/EventsTemplate';
import { GetCurrentSituationReport, DownloadSituationReport, EmailSituationReport } from './src/UMI/SituationReport/CurrentSituationReport';
import { GetSituationReport, InsertSituationReport, UpdateSituationReport, DeleteSituationReport, UploadSituationReport} from './src/UMI/SituationReport/SituationReport';
import { GetOngoingAndExtendedMonitoring } from './src/AlertGeneration/PublicAlerts';

const UserManagement = {
    AuthRegistration,
    UserAuthentication
}

const AlertGeneration = {
    GetOngoingAndExtendedMonitoring
}

const MarCommunityRiskAssessment = {
    UploadCommunityRiskAssessment,
    GetCommunityRiskAssessment,
    InsertCapacityAndVulnerability, 
    UpdateCapacityAndVulnerability,
    GetAllCapacityAndVulnerability,
    GetOneCapacityAndVulnerability,
    DeleteCapacityAndVulnerability,
    GetHazardMaps,
    UploadHazardMaps, 
}

const MarMaintenanceLogs = {
    GetIncidentLogs,
    InsertIncidentLogs,
    UpdateIncidentLogs,
    DeleteIncidentLogs,
    GetMaintenanceLogs,
    InsertMaintenanceLogs,
    UpdateMaintenanceLogs,
    DeleteMaintenanceLogs
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
}

const UmiFieldSurvey = {
    GetFieldSurveyLogs,
    InsertFieldSurveyLogs,
    UpdateFieldSurveyLogs,
    DeleteFieldSurveyLogs,
    GetLatestReportSummary,
    DownloadLatestReportSummary,
    EmailLatestReportSummary
}

const MarEventsTemplate = {
    InsertEventsTemplate,
    UpdateEventsTemplate,
    GetAllEventsTemplate,
    DeleteEventsTemplate
}

const UmiSituationReport = {
    GetSituationReport,
    GetCurrentSituationReport,
    DownloadSituationReport,
    EmailSituationReport,
    UploadSituationReport,
    InsertSituationReport,
    UpdateSituationReport,
    DeleteSituationReport
}

export {
    AlertGeneration,
    UserManagement,
    MarCommunityRiskAssessment,
    MarMaintenanceLogs,
    MarEventsTemplate,
    UmiRiskManagement,
    UmiFieldSurvey,
    UmiSituationReport
}