import { Module } from '@nestjs/common';
import { PokeApiService } from './pokeapi.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PokeApiService],
  exports: [PokeApiService]
})
export class PokeApiModule {}
