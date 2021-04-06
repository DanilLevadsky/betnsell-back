import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	OneToOne,
	JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Auction {

	@PrimaryGeneratedColumn()
	id: number;

	@Column("int", { nullable: false })
	status: number;

	@ManyToMany(type => User, user => user.id)
	customers: User[];

	@OneToOne(type => User, user => user.id)
	owner: User;

	@OneToOne(type => Product, product => product.id)
	@JoinColumn()
	product: Product;

	@Column("timestamp", { nullable: false })
	finish: Date;

	@Column("timestamp", { nullable: false })
	expire: Date;

	@OneToOne(type => User, user => user.id)
	winner: User;

}
