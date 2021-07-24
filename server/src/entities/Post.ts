// import { Entity, PrimaryKey, Property as Column } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import {BaseEntity,Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne } from 'typeorm'
import { User } from "./Users";

@ObjectType()
@Entity()
export class Post extends BaseEntity{
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
  @Column({type:'text'})
  title!: string;
 
  @Field()
  @ManyToOne(()=> User, (user) => user.posts)
  creator: User;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({type:"int",default:0})
  points!: number;
}