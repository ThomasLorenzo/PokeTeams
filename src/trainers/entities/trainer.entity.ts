import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrainerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    nome: string;

    @Column({ length: 120, nullable: true })
    cidadeOrigem?: string;
}
