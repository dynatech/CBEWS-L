import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { GetAllSummary, InsertSummary, UpdateSummary, DeleteSummary } from './src/UMI/RiskAssessment/Summary';

const UserManagement = {
    AuthRegistration,
    UserAuthentication
}

const UmiRiskManagement = {
    GetAllSummary,
    InsertSummary,
    UpdateSummary,
    DeleteSummary
}

export {
    UserManagement,
    UmiRiskManagement
}