import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 🔐 Importation du guard
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Movies')
@ApiBearerAuth()  
@Controller('movies')
@UseGuards(JwtAuthGuard) 
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * ✅ Endpoint `/movies` : Recherche de films par titre ou liste populaire
   */
  @Get()
  @ApiOperation({ summary: 'Obtenir une liste de films avec pagination, recherche et tri (🔒 Authentification requise)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de la page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Titre du film à rechercher' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Tri des résultats (ex: popularity.desc)' })
  async getMovies(
    @Query('page') page: number = 1,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.moviesService.getMovies(page, search, sort);
  }

  /**
   * ✅ Endpoint `/movies/:id` : Récupérer les détails d’un film par son ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d’un film par son ID' })
  @ApiParam({ name: 'id', description: 'ID du film' })
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }
}
