import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TeamsService } from '../teams/teams.service';

@Controller('trainers')
export class TrainersController {
    constructor(
        private readonly trainersService: TrainersService,
        private readonly teamsService: TeamsService,
    ) {}

    @Post()
    create(@Body() dto: CreateTrainerDto) {
        return this.trainersService.create(dto);
    }

    @Get()
    findAll() {
        return this.trainersService.findAll();
    }

    // Usa o método do TeamsService mas define aqui para o endpoint ser trainers/:id/teams
    @Get(':id/teams')
    findAllByTrainer(@Param('id', ParseIntPipe) trainerId: number) {
        return this.teamsService.findAllByTrainer(trainerId);
    }

    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.trainersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrainerDto) {
        return this.trainersService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.trainersService.remove(id);
    }
}
