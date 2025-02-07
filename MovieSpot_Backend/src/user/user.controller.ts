import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Inscrire un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur inscrit avec succès.' })
  @ApiBody({
    description: 'Données d\'inscription de l\'utilisateur',
    type: RegisterDto,
    examples: {
      'application/json': {
        value: {
          email: 'thomas@gmail.com',
          password: 'thomas',
          username: 'thomaste'
        }
      }
    }
  })
  @Post('register')
  async inscrire(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token JWT.' })
  @ApiBody({
    description: 'Données de connexion de l\'utilisateur',
    type: LoginDto,
    examples: {
      'application/json': {
        value: {
          email: 'thomas@gmail.com',
          password: 'thomas'
        }
      }
    }
  })
  @Post('login')
  async connecter(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
