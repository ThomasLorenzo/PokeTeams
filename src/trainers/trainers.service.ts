import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
    constructor(@InjectRepository(Trainer) private repository: Repository<Trainer>) {}

    create(dto: CreateTrainerDto) {
        const trainer = this.repository.create(dto);
        return this.repository.save(trainer);
    }

    async findAll() {
        const trainers = await this.repository.find();
        if (trainers.length === 0) {
            throw new NotFoundException('Nenhum treinador encontrado');
        }
        return trainers;
    }

    async findOne(id: number) {
        const trainer = await this.repository.findOne({ where: { id } });
        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }
        return trainer;
    }

    async update(id: number, dto: UpdateTrainerDto) {
        const trainer = await this.findOne(id);
        Object.assign(trainer, dto);
        return this.repository.save(trainer);
    }

    async remove(id: number) {
        const trainer = await this.findOne(id);
        await this.repository.remove(trainer);
        return { deleted: true };
    }
}
