import moment from 'moment';

const getGreeting = (timestamp = moment()) => {
    let ts = moment();
    if (timestamp) ts = timestamp;
    const hour = ts.hours();
    let greeting = ""

    if (hour == 0) greeting = "gabi"
    else if (hour < 11) greeting = "umaga"
    else if (hour == 12) greeting = "tanghali"
    else if (hour < 18) greeting = "hapon"
    else greeting = "gabi"

    return greeting
}

export default { getGreeting }