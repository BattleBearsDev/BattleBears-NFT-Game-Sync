import axios from "axios";

const GATEWAY_URL = "https://api-nft.skyvu.vn"
//const GATEWAY_URL = "http://localhost:4000"

export const linkWallet = (address, requestId) =>  {
    const body = {
        address: address,
        requestId: requestId
    }
    console.log(JSON.stringify(body))

    return new Promise((resolve, reject) => {
        axios.post(`${GATEWAY_URL}/account/link`, body).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}


