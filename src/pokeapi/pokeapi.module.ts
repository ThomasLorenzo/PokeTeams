import { Module } from '@nestjs/common';
import { PokeApiService } from './pokeapi.service';

@Module({
  providers: [PokeApiService]
})
export class PokeApiModule {}
