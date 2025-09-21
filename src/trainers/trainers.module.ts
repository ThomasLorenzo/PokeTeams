import { Module } from '@nestjs/common';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer]), TeamsModule],
  controllers: [TrainersController],
  providers: [TrainersService],
  exports: [TypeOrmModule]
})
export class TrainersModule {}
