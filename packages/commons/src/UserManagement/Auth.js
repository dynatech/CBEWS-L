import AppConfig from '../utils/AppConfig';

const AuthRegistration = (credentials) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/auth/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson
    })
    .catch((error) => {
        console.log(error)
    });
}

const UserAuthentication = (credentials) => {
    return fetch(`${AppConfig.HOSTNAME}/v2/auth/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
    .catch((error) => {
        console.log(error)
    });
}

export { AuthRegistration, UserAuthentication }