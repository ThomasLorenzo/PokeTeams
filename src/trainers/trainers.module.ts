import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerEntity } from './entities/trainer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerEntity])],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TypeOrmModule]
})
export class TrainersModule {}
