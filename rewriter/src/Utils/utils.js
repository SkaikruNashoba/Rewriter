export async function fetchData(method, url, body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (body) Object.assign(options, {body: body});
    const response = await fetch(`http://localhost:8080/${url}`, options);
    const data = await response.json();
    if (response.ok) {
        return {data};
    } else {
        return {data};
    }
}

// export async function fetchData(method, url, body = null) {
//     const options = {
//         method,
//         headers: {
//             "Content-Type": "application/json",
//         },
//     };
//     if (body) Object.assign(options, {body: body});
//     const response = await fetch(`https://g69zts9kd6.execute-api.eu-west-3.amazonaws.com/dev/${url}`, options);
//     const data = await response.json();
//     if (response.ok) {
//         return {data};
//     } else {
//         return {data};
//     }
// }
