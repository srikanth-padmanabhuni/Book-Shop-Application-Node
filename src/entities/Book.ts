import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { BookType } from "../constants/interfaces";
import { User } from "./User";

@Entity({
    name: "book"
})
export class Book extends BaseEntity {

    @PrimaryColumn({
        generated: "increment",
        type: "bigint"
    })
    id: number;

    @Column({
        unique: true,
        nullable: false
    })
    bookName: string;

    @ManyToOne(
        (type) => User,
        user => user
    )
    @JoinColumn({
        name: "author_id"
    })
    @Column({
        name: "author_id"
    })
    author_id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: "bigint"
    })
    availableStock: number;

    @Column({
        nullable: false,
        type: "enum",
        enum: BookType
    })
    bookType: string;
}