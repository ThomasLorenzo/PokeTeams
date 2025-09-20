import { Module } from '@nestjs/common';
import { TeamPokemonController } from './team-pokemon.controller';
import { TeamPokemonService } from './team-pokemon.service';

@Module({
  controllers: [TeamPokemonController],
  providers: [TeamPokemonService]
})
export class TeamPokemonModule {}
