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

const UserManagement = {
    AuthRegistration,
    UserAuthentication
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
    DeleteFamilyRiskProfile
}

export {
    UserManagement,
    MarCommunityRiskAssessment,
    UmiRiskManagement,
    MarMaintenanceLogs
}