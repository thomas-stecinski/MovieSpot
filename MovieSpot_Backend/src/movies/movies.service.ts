import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.themoviedb.org/3';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') ?? '';

    if (!this.apiKey) {
      throw new Error('❌ Clé API TMDb manquante ! Vérifiez votre fichier .env.');
    }
  }

  private async fetchFromTMDb(endpoint: string, queryParams: string = ''): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?api_key=${this.apiKey}&${queryParams}`;
    
    console.log(`🔍 URL envoyée : ${url}`); // Debug

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur API TMDb :`, error.response?.data || error.message);
      throw new Error('Impossible de récupérer les données depuis TMDb.');
    }
  }

  /**
   * ✅ Endpoint `/movies` :
   * - Gère la pagination (`page`)
   * - Gère la recherche (`search`)
   * - Gère le tri (`sort`)
   */
  async getMovies(page: number = 1, search?: string, sort?: string): Promise<any> {
    let endpoint = search ? '/search/movie' : '/movie/popular'; // Recherche ou films populaires
    let queryParams = `page=${page}`;

    if (search) {
      queryParams += `&query=${encodeURIComponent(search)}`;
    }
    
    if (sort) {
      queryParams += `&sort_by=${sort}`;
    }

    return this.fetchFromTMDb(endpoint, queryParams);
  }

  /**
   * ✅ Endpoint `/movies/:id` : Récupérer un film par ID
   */
  async getMovieById(id: string): Promise<any> {
    const endpoint = `/movie/${id}`;
    return this.fetchFromTMDb(endpoint, ''); // L'ID est directement dans l'URL, pas besoin de query
  }
}
