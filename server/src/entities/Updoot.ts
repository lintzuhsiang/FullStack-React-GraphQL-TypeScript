// import { Entity, PrimaryKey, Property as Column } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import {BaseEntity,Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne } from 'typeorm'
import { Post } from "./Post";
import { User } from "./Users";
// m to n

// user -> updoot <- posts

@ObjectType()
@Entity()
export class Updoot extends BaseEntity{
  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field()
  @Column()
  value: number;

  @Field(()=>User)
  @ManyToOne(()=> User, (user) => user.updoots)
  user: User;
 
  @Field(()=>Post)
  @ManyToOne(()=> Post, (post) => post.updoots,{
    onDelete:"CASCADE"
  })
  post: Post;

  @Field()
  @PrimaryColumn()
  postId: number;

    
}