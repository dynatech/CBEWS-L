import axios from "axios";

export function axiosPOST (api_link, data, callback = null) {
    const headers = {
        'Access-Control-Allow-Origin': 'localhost:4000'
        // 'Access-Control-Allow-Origin': 'http://ec2-3-138-244-233.us-east-2.compute.amazonaws.com/'
      };
    
    //console.log(data);
    axios.post(api_link, {...data})
    .then((response) => {
        const { data } = response; 
        if (callback !== null) {
            callback(data);
        } 
    })
    .catch((error) => {
        console.log(error);
    });
}
export function axiosGET (api_link, callback = null) {
    const headers = {
      };
    axios.get(api_link, headers)
    .then((response) => {
        const { data } = response; 
        if (callback !== null) {
            callback(data);
        } 
    })
    .catch((error) => {
        console.log(error);
    });
}
