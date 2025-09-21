import { Team } from "../../teams/entities/team.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, JoinColumn } from "typeorm";

@Entity()
@Unique(['time', 'pokemonIdOuNome'])
export class TeamPokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, (team) => team.pokemon, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'timeId' })
    time: Team;

    @Column({ length: 50, nullable: false })
    pokemonIdOuNome: string;
}
