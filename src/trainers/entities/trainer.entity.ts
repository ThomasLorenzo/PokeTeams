import { Team } from "src/teams/entities/team.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trainer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nome: string;

    @Column({ length: 100, nullable: true })
    cidadeOrigem?: string;

    @OneToMany(() => Team, (team) => team.treinador) 
    times: Team[];
}
