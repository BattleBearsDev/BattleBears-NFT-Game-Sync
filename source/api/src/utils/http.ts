import axios, { Method } from 'axios'

const makeRequest = axios.create({
    baseURL: process.env.SKYFAB_API,
    timeout: 20000,
    headers: {
        'content-type': 'application/json',
        'apiKey': process.env.SKYFAB_API_KEY || 'NO_API_KEY',
    },
})

const request = (method: Method ,url: string, data: any, params: any) : Promise<any> => {
    return new Promise((resolve, reject) => {
       makeRequest(url, {method, data, params})
           .then(response => {
               if(response.status == 200 && !response.data.error) {
                   resolve(response.data)
               }
               else {
                   reject(response.data.message)
               }
           })
           .catch(error => {
               reject(error.response.data)
           })
    });
}

export const get = (path : string, data: any, params: any) : Promise<any> => {
    return request('GET', path, data, params);
}

export const post = (path : string, data: any, params: any) : Promise<any> => {
    return request('POST', path, data, params);
}

export const put = (path : string, data: any, params: any) : Promise<any> => {
    return request('PUT', path, data, params);
}