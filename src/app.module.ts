import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TrainersModule } from './trainers/trainers.module';
import { TeamsModule } from './teams/teams.module';
import { TeamPokemonModule } from './team-pokemon/team-pokemon.module';
import { PokeApiModule } from './pokeapi/pokeapi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TrainersModule,
    TeamsModule,
    TeamPokemonModule,
    PokeApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
