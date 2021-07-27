import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/posts";
import { UserResolver } from "./resolvers/users";
import Redis from "ioredis";
import session from "express-session";
import cors from "cors";
import { User } from "./entities/Users";
import { Post } from "./entities/Post";
import { createConnection } from "typeorm";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./util/createUserLoader";
import { createUpdootLoader } from "./util/createUpdootLoader";

//rerun 
const main = async () => {
  // app.get('/',(_,res)=>{
  //     res.send('hello')c
  // })
  // const orm = await MikroORM.init(mikroOrmConfig);
  console.log('dirname',__dirname);

  const conn = await createConnection({
    type: "postgres",
    database: "shinelin",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User,Updoot],
  });
  await conn.runMigrations();

  // await orm.em.nativeDelete(User,{})
  // await orm.getMigrator().up();
  // const posts = await orm.em.create(Post,{title:"my first post"})
  // await orm.em.persistAndFlush(posts)
  // console.log(posts)
  // await orm.em.nativeInsert(Post,{title:"second post"})

//   await Post.delete({});
//   await User.delete({});

  const app = express();

  // sendEmail("shine@shine.com","hello")
  const RedisStore = require("connect-redis")(session);
  // const RedisStore = connectRedis(session)
  // let redisClient = redis.createClient()
  const redis = new Redis();
  redis.get;

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 86400 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", //csrf
        secure: __prod__,
      },
      secret: "jhugl",
      saveUninitialized: false,
      resave: false,
    })
  );

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis,userLoader:createUserLoader(),updootLoader:createUpdootLoader() }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("server started on local host: 4000");
  });
};

main();
