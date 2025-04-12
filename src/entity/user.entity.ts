import { Column, Entity, OneToMany } from "typeorm";
import { GlobalEntity } from "./global.entity";
import { Task } from "./task.entity";
import { ROLES } from "src/types/base.type";

/**
 * Represents a user entity with properties for email, password, and associated tasks.
 */
@Entity("User")
export class User extends GlobalEntity{
    constructor() {
        super();
    }
    @Column()
    email: string;

    @Column()
    password:string

    @OneToMany(()=>Task,(task)=>task.user,{nullable:true})
    tasks:Task[]

    @Column({type:"enum",enum:ROLES,default:ROLES.USER})
    role:ROLES

    @Column({default:false})
    isEmailVerified:boolean

    @Column({default:false})
    isBlocked:boolean

}