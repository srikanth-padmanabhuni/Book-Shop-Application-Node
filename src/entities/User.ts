import { UserRole } from "../constants/interfaces";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"

@Entity({name: "users"})
export class User extends BaseEntity{
    
    @PrimaryColumn({
        type: 'bigint',
        generated: "increment"
    })
    id: number

    @Column()
    firstName: string;
    
    @Column()
    lastName: string;

    @Column({
        unique: true
    })
    userName: string;

    @Column({
        nullable: false
    })
    password: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: UserRole,
        default: UserRole.READER
    })
    role: string;

    @Column({
        type: 'boolean',
        default: 'true'
    })
    active: boolean;

    @Column({
        type: 'boolean',
        default: 'false'
    })
    deleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    lastLoggedInAt: Date;
}