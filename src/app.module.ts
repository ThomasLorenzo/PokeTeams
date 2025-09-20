import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrainersModule } from './trainers/trainers.module';
import { TeamsModule } from './teams/teams.module';
import { TeamPokemonModule } from './team-pokemon/team-pokemon.module';
import { PokeApiModule } from './pokeapi/pokeapi.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Torna .env disponível para todo o app
    ConfigModule.forRoot({ 
      isGlobal: true,
   }),

    // Conexão com Postgres via TypeORM (usando variáveis do .env)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // Módulos da aplicação
    TrainersModule,
    TeamsModule,
    TeamPokemonModule,
    PokeApiModule
  ],
})
export class AppModule {}
