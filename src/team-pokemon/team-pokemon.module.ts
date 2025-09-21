import { Module } from '@nestjs/common';
import { TeamPokemonController } from './team-pokemon.controller';
import { TeamPokemonService } from './team-pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { Team } from 'src/teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPokemon, Team])],
  controllers: [TeamPokemonController],
  providers: [TeamPokemonService]
})
export class TeamPokemonModule {}
