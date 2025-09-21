import { Module } from '@nestjs/common';
import { TeamPokemonController } from './team-pokemon.controller';
import { TeamPokemonService } from './team-pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPokemon } from './entities/team-pokemon.entity';
import { Team } from '../teams/entities/team.entity';
import { PokeApiModule } from '../pokeapi/pokeapi.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPokemon, Team]), PokeApiModule],
  controllers: [TeamPokemonController],
  providers: [TeamPokemonService]
})
export class TeamPokemonModule {}
