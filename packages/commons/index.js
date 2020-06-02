import { AuthRegistration, UserAuthentication } from './src/UserManagement/Auth';
import { UploadCommunityRiskAssessment, GetCommunityRiskAssessment } from './src/MAR/CommunityRiskAssessment/CommunityRiskAssessment';

const UserManagement = {
    AuthRegistration,
    UserAuthentication
}

const MarCommunityRiskAssessment = {
    UploadCommunityRiskAssessment,
    GetCommunityRiskAssessment
}

export {
    UserManagement,
    MarCommunityRiskAssessment
}