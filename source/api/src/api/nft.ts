import express, { NextFunction, Request, Response } from 'express'
import {getNftInfo} from '../domain/nft'
import {AssetInfo} from "../dto";

const router = express.Router();

router.get('/:nftId', async (req : Request, res: Response, next: NextFunction) => {
    try {
        const info = await getNftInfo(parseInt(req.params.nftId));
        const assetDict =  info["asset"]
        const asset : AssetInfo = {
            id: assetDict["index"],
            total: assetDict["params"]["total"],
            creator: assetDict["params"]["creator"],
            name: assetDict["params"]["name"],
            unitName: assetDict["params"]["unit-name"],
            decimals: assetDict["params"]["decimals"]
        }
        res.status(200).json({
            error: false,
            message: 'OK',
            data: asset}
        );
    } catch(error) {
        next(error);
    }
});

export default router;