import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length, IsEmail, IsMobilePhone, Min, MaxLength } from "class-validator";

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false, unique: true })
	@Length(4, 32)
	username: string;

	@Column({ nullable: false, unique: true })
	@IsEmail()
	mail: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: false, unique: true })
	@MaxLength(12)
	@IsMobilePhone()
	phone: string

	@Column({ default: 0 })
	@Min(0)
	balance: number;

	@Column()
	@MaxLength(32)
	name: string

	@Column()
	profilePic: string;

}
