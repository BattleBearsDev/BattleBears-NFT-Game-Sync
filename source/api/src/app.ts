import express, { Application} from "express"
import cors from 'cors';
import bodyParser from "body-parser"
import morgan from 'morgan'
import account from './api/account'
import nft from './api/nft'
import {errorHandler} from "./middleware/error";

const app: Application = express();
app.use(morgan('combined', {
    skip: (req) => { 
        return req.path === '/health-check';
    }
}));

app.use(cors());
//app.options('*', cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use('/health-check',  (req, res) => res.send('OK'));
app.use('/account', account)
app.use('/nft', nft)
app.use(errorHandler({debug: false}));
export default app;