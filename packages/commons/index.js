import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { UploadCommunityRiskAssessment, GetCommunityRiskAssessment } from './src/MAR/CommunityRiskAssessment/CommunityRiskAssessment';
import { GetAllCapacityAndVulnerability, GetOneCapacityAndVulnerability, SubmitCapacityAndVulnerability, DeleteCapacityAndVulnerability } from './src/MAR/CommunityRiskAssessment/CapacityAndVulnerability';
import { GetHazardMaps, UploadHazardMaps, } from './src/MAR/CommunityRiskAssessment/HazardMaps';
import { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary } from './src/UMI/RiskAssessment/Summary';
import { GetAllHazardData, InsertHazardData, UpdateHazardData, DeleteHazardData } from './src/UMI/RiskAssessment/HazardData';
import { GetAllResourceAndCapacities, InsertResourceAndCapacities, UpdateResourceAndCapacities, DeleteResourceAndCapacities } from './src/UMI/RiskAssessment/ResourceAndCapacities';
import { GetAllFamilyRiskProfile, InsertFamilyRiskProfile, UpdateFamilyRiskProfile, DeleteFamilyRiskProfile } from './src/UMI/RiskAssessment/FamilyRiskProfile';

const UserManagement = {
    AuthRegistration,
    UserAuthentication
}

const MarCommunityRiskAssessment = {
    UploadCommunityRiskAssessment,
    GetCommunityRiskAssessment,
    SubmitCapacityAndVulnerability,
    GetAllCapacityAndVulnerability,
    GetOneCapacityAndVulnerability,
    DeleteCapacityAndVulnerability,
    GetHazardMaps,
    UploadHazardMaps, 
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
    UmiRiskManagement
}