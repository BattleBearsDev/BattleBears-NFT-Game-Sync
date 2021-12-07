type Asset = {
    id: number,
    amount: number
}

type AssetInfo = {
    id: number,
    total: number,
    creator: string,
    name: string,
    unitName: string,
    decimals: number
}

type Account = {
    address: string,
    amount: number,
    assets: Array<Asset>
}

type BaseResponse = {
    error: boolean,
    message: string,
    data?: any,
}

export type {Asset, Account, AssetInfo, BaseResponse}