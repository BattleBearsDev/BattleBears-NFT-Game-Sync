import express, { NextFunction, Request, Response } from 'express'
import {
    getAccountInfo,
    linkWallet,
    unlinkWallet,
    addRequest,
    addPoolingRequest,
    getPlayerInfo
} from '../domain/account'
import jwtDecode from "jwt-decode";

const router = express.Router();

router.get('/:accountAddress', async (req : Request, res: Response, next: NextFunction) => {
    try {
        const info = await getAccountInfo(req.params.accountAddress);
        res.status(200).json( {
            error: false,
            message: 'OK',
            data: info,
        });
        return next()
    } catch(error) {
        next(error);
    }
});

router.get('/player/info', async (req : Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const token :string = req.headers['playerToken'] || req.headers['playertoken']
        const payload: any = jwtDecode(token)
        const playerId = payload["PlayerId"]

        const info = await getPlayerInfo(payload.PlayerId);
        res.status(200).json( {
            error: false,
            message: 'OK',
            data: info,
        });
        return next()
    } catch(error) {
        next(error);
    }
});

router.get('/:playerId/requestLink', async (req : Request, res: Response, next: NextFunction) => {
    try {
        const reqId = await addRequest(req.params.playerId)
        res.status(200).json( {
            error: false,
            message: 'OK',
            data: reqId,
        });
        return next()
    } catch(error) {
        console.log("error", error)
        next(error);
    }
});

router.get('/listen/:requestId', async (req : Request, res: Response, next: NextFunction) => {
    try {
        await addPoolingRequest(req.params.requestId, res)
    } catch(error) {
        next(error);
    }
});

router.post("/link", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, requestId } = req.body;
        await linkWallet(address, requestId)
        res.status(200).json({
            error: false,
            message: 'OK',
        });
    } catch (error) {
        next(error);
    }
})

router.put("/unlink", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerId } = req.body;
        await unlinkWallet(playerId)
        res.status(200).json({
            error: false,
            message: 'OK',
        });
    } catch (error) {
        next(error);
    }
})

export default router;