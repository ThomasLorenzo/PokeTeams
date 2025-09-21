import { Team } from "src/teams/entities/team.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['time', 'pokemonIdOuNome'])
export class TeamPokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team, (team) => team.pokemon, { nullable: false, onDelete: 'CASCADE' })
    time: Team;

    @Column({ length: 50 })
    pokemonIdOuNome: string;
}
