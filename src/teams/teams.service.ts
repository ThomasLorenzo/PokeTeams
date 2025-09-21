import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { Trainer } from '../trainers/entities/trainer.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team) private teamsRepository: Repository<Team>,
        @InjectRepository(Trainer) private trainersRepository: Repository<Trainer>
    ) {}

    async create(dto: CreateTeamDto): Promise<TeamResponseDto> {
        // Verifica se o treinador a adicionar no time existe
        const trainer = await this.trainersRepository.findOne({ where: { id: dto.treinadorId } });

        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }
        
        const team = this.teamsRepository.create({
            nome: dto.nome,
            treinadorId: dto.treinadorId,
            treinador: trainer,
        });

        return this.teamsRepository.save(team);
    }

    async findAll(): Promise<TeamResponseDto[]> {
        // Busca todos os times, ligando com os treinadores
        const teams = await this.teamsRepository.find({ relations: ['treinador'] });
        
        if (teams.length === 0) {
            throw new NotFoundException('Nenhum time encontrado');
        }
        
        return teams;
    }

    // Método consumido no TrainersController em /trainers/:id/teams
    async findAllByTrainer(trainerId: number): Promise<TeamResponseDto[]> {
        // Busca os times de um treinador pelo id
        const teams = await this.teamsRepository.find({
            where: { treinador: { id: trainerId } },
            relations: ['treinador'],
        });

        if (teams.length === 0) {
            throw new NotFoundException('Nenhum time encontrado para o treinador informado');
        }

        return teams;
    }

    async findOne(id: number): Promise<TeamResponseDto> {
        // Busca um time pelo id 
        const team = await this.teamsRepository.findOne({ where: { id }, relations: ['treinador'] });
        
        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }

        return team;
    }

    async update(id: number, dto: UpdateTeamDto): Promise<TeamResponseDto> {
        // Busca um time pelo id
        const team = await this.findOne(id);

        if (dto.nome) {
            team.nome = dto.nome;
        }
        
        if (dto.treinadorId) {
            // Verifica se o novo treinador existe
            const trainer = await this.trainersRepository.findOne({ where: { id: dto.treinadorId } });
            
            if (!trainer) {
                throw new NotFoundException('Treinador não encontrado');
            }

            team.treinadorId = dto.treinadorId;
            team.treinador = trainer;
        }

        return this.teamsRepository.save(team);
    }

    async remove(id: number): Promise<{ deleted: boolean }> {
        // Busca um time pelo id
        const team = await this.teamsRepository.findOne({ where: { id } });
        
        if (!team) {
            throw new NotFoundException('Time não encontrado');
        }

        await this.teamsRepository.remove(team);

        return { deleted: true };
    }
}
