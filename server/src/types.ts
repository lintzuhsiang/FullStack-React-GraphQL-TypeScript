// import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request,Response} from 'express'
import {Redis}  from "ioredis";
// import {Session, SessionData } from 'express-session'

export type MyContext = {
    // em:  EntityManager<any> & EntityManager<IDatabaseDriver<Connection>> ;
    req: Request & {session: Express.Session } //& Partial<SessionData> & { userId:number };
    res: Response;
    redis: Redis
}