import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MaxLength, Length, IsPositive } from "class-validator";

@Entity()
export class Product {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	@Length(4, 32)
	title: string

	@Column({ nullable: true })
	@MaxLength(255)
	description: string;

	@Column({ nullable: false })
	@IsPositive()
	price: number;

	@Column({ nullable: false })
	photo: string;

}
