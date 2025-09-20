import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainerEntity } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
    constructor(@InjectRepository(TrainerEntity) private repository: Repository<TrainerEntity>) {}

    create(dto: CreateTrainerDto) {
        const entity = this.repository.create(dto);
        return this.repository.save(entity);
    }

    findAll() {
        return this.repository.find();
    }

    async findOne(id: number) {
        const trainer = await this.repository.findOne({ where: { id } });
        if (!trainer) {
            throw new NotFoundException('Treinador não encontrado');
        }
        return trainer;
    }

    async update(id: number, dto: UpdateTrainerDto) {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        return this.repository.save(entity);
    }

    async remove(id: number) {
        const entity = await this.findOne(id);
        await this.repository.remove(entity);
        return { deleted: true };
    }
}
