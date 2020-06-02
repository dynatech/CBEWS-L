import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary } from './src/UMI/RiskAssessment/Summary';
import { GetAllHazardData, InsertHazardData, UpdateHazardData, DeleteHazardData } from './src/UMI/RiskAssessment/HazardData';
import { GetAllResourceAndCapacities, InsertResourceAndCapacities, UpdateResourceAndCapacities, DeleteResourceAndCapacities } from './src/UMI/RiskAssessment/ResourceAndCapacities';
import { GetAllFamilyRiskProfile, InsertFamilyRiskProfile, UpdateFamilyRiskProfile, DeleteFamilyRiskProfile } from './src/UMI/RiskAssessment/FamilyRiskProfile';

const UserManagement = {
    AuthRegistration,
    UserAuthentication
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
    UmiRiskManagement
}