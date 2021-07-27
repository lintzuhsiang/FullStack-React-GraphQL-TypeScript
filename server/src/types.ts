// import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request,Response} from 'express'
import {Redis}  from "ioredis";
// import {Express.Session} from "express-session";
import { createUserLoader } from './util/createUserLoader';
import {createUpdootLoader} from './util/createUpdootLoader';

export type MyContext = {
    // em:  EntityManager<any> & EntityManager<IDatabaseDriver<Connection>> ;
    req: Request & {session: Express.Session & Partial<Express.SessionData> & { userId:number }};
    res: Response;
    redis: Redis
    userLoader: ReturnType<typeof createUserLoader>
    updootLoader: ReturnType<typeof createUpdootLoader>
}