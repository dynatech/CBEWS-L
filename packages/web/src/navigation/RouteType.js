import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { useCookies } from "react-cookie";


export const DashRedirectIfLoggedIn = ({...props}) => {
    const [cookies] = useCookies(["credentials"]);
    const is_logged_out = cookies.credentials === undefined ? true : false;
    console.log(is_logged_out);

    return(is_logged_out
        ? (<Route {...props}/>)
        : (<Redirect to="/dashboard" />)
    );
};

export const PrivateRoute = ({...props}) => {
    const [cookies] = useCookies(["credentials"]);
    const is_logged_in = cookies.credentials === undefined ? true : false;
    console.log(is_logged_in);

    return(is_logged_in
        ? (<Route {...props}/>)
        : (<Redirect to="/signin" />)
    );
};