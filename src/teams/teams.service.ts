import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Trainer } from '../trainers/entities/trainer.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team) private teamsRepository: Repository<Team>,
        @InjectRepository(Trainer) private trainersRepository: Repository<Trainer>
    ) {}

    async create(dto: CreateTeamDto) {
        // Checa se o treinador adicionado ao time existe
        const trainer = await this.trainersRepository.findOne({ where: { id: dto.treinadorId } });
        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }
        // Se existir, já cria o time ligado ao treinador
        const team = this.teamsRepository.create({
            nome: dto.nome,
            treinador: trainer,
        });
        return this.teamsRepository.save(team);
    }

    async findAll() {
        const teams = await this.teamsRepository.find({ relations: ['treinador'] });
        if (teams.length === 0) {
            throw new NotFoundException('Nenhum time encontrado');
        }
        return teams;
    }

    // Método consumido no TrainersController em /trainers/:id/teams
    async findAllByTrainer(trainerId: number) {
        const teams = await this.teamsRepository.find({
            where: { treinador: { id: trainerId } },
            relations: ['treinador'],
        });
        if (teams.length === 0) {
            throw new NotFoundException('Nenhum time encontrado para o treinador informado');
        }
        return teams;
    }

    async findOne(id: number) {
        const team = await this.teamsRepository.findOne({ where: { id }, relations: ['treinador'] });
        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }
        return team;
    }

    async update(id: number, dto: UpdateTeamDto) {
        const team = await this.findOne(id);
        if (dto.nome) {
            team.nome = dto.nome;
        }
        if (dto.treinadorId) {
            (team as any).treinador = { id: dto.treinadorId } as any;
        }
        return this.teamsRepository.save(team);
    }

    async remove(id: number) {
        const team = await this.findOne(id);
        await this.teamsRepository.remove(team);
        return { deleted: true };
    }
}
