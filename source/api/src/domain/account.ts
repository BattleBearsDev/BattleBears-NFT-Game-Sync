import { indexerClient } from "../global";
import type { Account } from "../dto";
import {get, put} from '../utils/http'
import {InternalServerError, ValidationError} from '../middleware/error'
import {Response} from "express";
const {
    v4: uuidv4,
} = require('uuid');
import logger from "../logger";
type RequestLink = {
    playerId: string
    response?: Response
}
let requestRecords: Record<string, RequestLink> = {}

export async function addRequest(playerId: string): Promise<string> {
    const reqId = uuidv4()
    requestRecords[reqId] = {
        playerId: playerId,
        response: undefined
    }
    return reqId;
}

export async function addPoolingRequest(requestId: string, response: Response)
{
    const request = requestRecords[requestId]
    request.response = response;
}

function DeleteFromRecord(id: string) {
    const filteredRecords : Record<string, RequestLink> = {}
    for(let key in requestRecords)
    {
        if(key != id)
        {
            filteredRecords[key] = requestRecords[key]
        }
    }
    requestRecords = filteredRecords;
}

export async function finishRequest(requestId : string, error: boolean) {
    const request = requestRecords[requestId]

    if(error)
    {
        request.response?.status(200).json({
            error: true,
            message: 'Unexpected error'
        })
    }
    else {
        request.response?.status(200).json({
            error: false,
            message: 'OK'
        })
    }
    request.response?.end()
    DeleteFromRecord(requestId)
}

export async function getAccountInfo(address: string) : Promise<Account> {
    try {
        const accountInfo = await indexerClient.lookupAccountByID(address).do();
        logger.info(JSON.stringify(accountInfo))
        const account : Account = {
            address: accountInfo["account"]["address"],
            amount: accountInfo["account"]["amount"],
            assets: []
        };

        const assets = accountInfo["account"]["assets"]
        if(assets)
        {
            for(let i = 0; i < assets.length; i ++)
            {
                account.assets.push({
                    id: accountInfo["account"]["assets"][i]["asset-id"],
                    amount: accountInfo["account"]["assets"][i]["amount"],
                })
            }
        }

        return account;
    }
    catch {
        throw new ValidationError("Cannot get account info")
    }
}

export async function linkWallet(address: string, requestId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        const request = requestRecords[requestId]
        if(request)
        {
            getAccountInfo(address).then(_ => {
                getPlayerProfile(request.playerId)
                    .then(profile => {
                        profile["nftAddress"] = address;
                        resolve(updatePlayerProfile(request.playerId, profile))
                        finishRequest(requestId, false)
                    })
                    .catch(error => {
                        finishRequest(requestId, true)
                        reject(error)
                    })
            }).catch(error => {
                finishRequest(requestId, true)
                reject(error)
            })
        }
        else {
            reject(new ValidationError("Could not find request"))
        }
    })
}

export async function unlinkWallet(playerId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        getPlayerProfile(playerId)
            .then(profile => {
                profile["nftAddress"] = '';
                profile["nftAsset"] = [];
                resolve(updatePlayerProfile(playerId, profile))
            })
            .catch(error => {
                reject(error)
            })
    })
}

export async function getPlayerInfo(playerId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        get(`players/${playerId}/info`, null, null)
            .then(async response => {
                const info = response.data
                logger.info(JSON.stringify(info))
                // add id because skyfab doesn add id
                info["playerId"] = playerId;

                if(info["profile"]["nftAddress"])
                {
                    const account : Account = await getAccountInfo(info["profile"]["nftAddress"])
                    info["profile"]["nftAsset"] = account.assets.filter(asset => asset.amount > 0).map(asset => asset.id)
                }
                else {
                    info["profile"]["nftAsset"] = []
                }
                resolve(info);
            })
            .catch(error => {
                reject(new ValidationError(error));
            })
    })
}

export async function getPlayerProfile(playerId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        get(`players/${playerId}/info`, null, null)
            .then(response => {
                resolve(response.data["profile"]);
            })
            .catch(error => {
                reject(new ValidationError(error));
            })
    })
}

export async function updatePlayerProfile(playerId: string, profile: any) {
    return new Promise((resolve, reject) => {
        put(`players/${playerId}/profile`, profile, null)
            .then(response => {
                resolve('OK');
            })
            .catch(error => {
                reject(new InternalServerError(error));
            })
    })
}