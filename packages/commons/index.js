import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary } from './src/UMI/RiskAssessment/Summary';
import { GetAllHazardData, InsertHazardData, UpdateHazardData, DeleteHazardData } from './src/UMI/RiskAssessment/HazardData';

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
    DeleteHazardData
}

export {
    UserManagement,
    UmiRiskManagement
}