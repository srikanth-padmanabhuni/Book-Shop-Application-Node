import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity({
    name: "subscription"
})
export class Subscription extends BaseEntity {

    @PrimaryColumn({
        type: "bigint",
        generated: "increment",
        name: "id"
    })
    id: number;

    @ManyToMany(
        () => User,
        user => user
    )
    @JoinColumn({
        name: "user_id"
    })
    @Column({
        name: "user_id",
        type: "bigint"
    })
    user_id: User;

    @ManyToMany(
        () => Book,
        book => book
    )
    @JoinColumn({
        name: "book_id"
    })
    @Column({
        name: "book_id",
        type: "bigint"
    })
    book_id: Book;

    @CreateDateColumn()
    subscribedOn: Date;

    @Column({
        type: "date"
    })
    validTill: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}