import axios from 'axios';
const baseURL = '';
const request = method => options => (dispatch, getState) => {
    return axios({
        baseURL,
        ...options,
        method,
        proxy: false,
    }).catch(error => {
        console.log('fetch request error:', error)
    });
}
export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const patch = request('PATCH');
export const remove = request('DELETE');
