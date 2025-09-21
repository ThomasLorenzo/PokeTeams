import { TeamPokemon } from "src/team-pokemon/entities/team-pokemon.entity";
import { Trainer } from "src/trainers/entities/trainer.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    nome: string;

    @Column({ nullable: false })
    treinadorId: number;

    @ManyToOne(() => Trainer, (trainer) => trainer.times, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'treinadorId' })
    treinador: Trainer;

    @OneToMany(() => TeamPokemon, (teamPokemon) => teamPokemon.time, { onDelete: 'CASCADE' })
    pokemon: TeamPokemon[]
}
