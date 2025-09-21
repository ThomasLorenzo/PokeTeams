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

interface CacheEntry {
  data: PokemonDetails;
  timestamp: number;
}

@Injectable()
export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTTL = 15 * 60 * 1000; // 15 minutos em millisegundos

  constructor(private readonly http: HttpService) {}

  // Tenta buscar os dados do pokémon na PokéAPI, se não encontrar, lança 404
  async fetchDetails(idOrName: string): Promise<PokemonDetails> {
    const normalizedIdOrName = idOrName.trim().toLowerCase();
    
    // Verifica se existe no cache e se ainda é válido
    const cached = this.cache.get(normalizedIdOrName);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return cached.data;
    }

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.http.get(`${this.baseUrl}/${idOrName}`)
      );

      const data = response.data;

      const pokemonDetails: PokemonDetails = {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.other['official-artwork'].front_default,
        tipos: data.types.map((typeEntry: { type: { name: string } }) => typeEntry.type.name),
        habilidades: data.abilities.map((abilitiesEntry: { ability: { name: string } }) => abilitiesEntry.ability.name)
      };

      // Armazena no cache os dados do pokémon
      this.cache.set(normalizedIdOrName, {
        data: pokemonDetails,
        timestamp: Date.now(),
      });

      return pokemonDetails;
    } catch {
      throw new NotFoundException(`Pokémon '${idOrName}' não encontrado na PokéAPI`);
    }
  }
}
