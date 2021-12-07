import Log4js, { Logger }  from "log4js";

const isDevelopment = process.env.NODE_ENV === 'development';

function getLogger(name: string) : Logger {
    const logger = Log4js.getLogger(name);
    logger.level = isDevelopment ? 'debug' : 'warn';
    return logger;
}

export default getLogger("api-algorand-nft")