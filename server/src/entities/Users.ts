// import { Entity, PrimaryKey, Property as Column } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity, OneToMany} from 'typeorm'
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(()=>String)
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @Field()
  @Column({unique:true})
  username!: string;

  @Field()
  @Column({unique:true})
  email!:string;

  @Column()
  password!: string;

  @OneToMany(()=>Post,(post) => post.creator)
  posts: Post[];
  
  @Field()
  creatorId:number;

}