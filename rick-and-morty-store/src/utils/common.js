import axios from 'axios';

export function get(url, headers) {
    return new Promise((resolve, reject)=>{
        axios.get(url).then((data) => {
            resolve(data)
        },(err)=>{
            reject(err)
        })
    })
}