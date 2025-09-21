import { Trainer } from "src/trainers/entities/trainer.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    nome: string;

    @ManyToOne(() => Trainer, (trainer) => trainer.times, { nullable: false, onDelete: 'CASCADE' })
    treinador: Trainer;
}
