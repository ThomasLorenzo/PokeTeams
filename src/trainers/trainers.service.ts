import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainerResponseDto } from './dto/trainer-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class TrainersService {
    constructor(@InjectRepository(Trainer) private repository: Repository<Trainer>) {}

    async create(dto: CreateTrainerDto): Promise<TrainerResponseDto> {
        const trainer = this.repository.create(dto);

        return this.repository.save(trainer);
    }

    async findAll(pagination: PaginationDto = { page: 1, limit: 10 }): Promise<PaginatedResponseDto<TrainerResponseDto>> {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        // Busca todos os treinadores com paginação
        const [trainers, total] = await this.repository.findAndCount({
            skip: skip,
            take: limit,
        });
        
        if (trainers.length === 0) {
            throw new NotFoundException('Nenhum treinador encontrado');
        }

        const totalPages = Math.ceil(total / limit);

        return {
            data: trainers,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    async findOne(id: number): Promise<TrainerResponseDto> {
        // Busca um treinador pelo id
        const trainer = await this.repository.findOne({ where: { id } });
        
        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }
        
        return trainer;
    }

    async update(id: number, dto: UpdateTrainerDto): Promise<TrainerResponseDto> {
        // Busca um treinador pelo id
        const trainer = await this.findOne(id);

        Object.assign(trainer, dto);
        
        return this.repository.save(trainer);
    }

    async remove(id: number): Promise<{ deleted: boolean }> {
        // Busca um treinador pelo id
        const trainer = await this.repository.findOne({ where: { id } });
        
        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }

        await this.repository.remove(trainer);
        
        return { deleted: true };
    }
}
