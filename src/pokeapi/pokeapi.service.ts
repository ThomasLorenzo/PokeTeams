import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

export interface PokemonDetails {
  id: number;
  nome: string;
  imagem: string;
  tipos: string[];
  habilidades: string[];
}

@Injectable()
export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private readonly http: HttpService) {}

  // Tenta buscar os dados do pokémon na PokéAPI, se não encontrar, lança 404
  async fetchDetails(idOrName: string): Promise<PokemonDetails> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.http.get(`${this.baseUrl}/${idOrName}`)
      );

      const data = response.data;

      return {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.other['official-artwork'].front_default,
        tipos: data.types.map((typeEntry: { type: { name: string } }) => typeEntry.type.name),
        habilidades: data.abilities.map((abilitiesEntry: { ability: { name: string } }) => abilitiesEntry.ability.name)
      };
    } catch {
      throw new NotFoundException(`Pokémon '${idOrName}' não encontrado na PokéAPI`);
    }
  }
}
