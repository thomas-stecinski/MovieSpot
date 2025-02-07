import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('devrait inscrire un utilisateur avec succès', async () => {
      const dto: RegisterDto = { email: 'test@example.com', password: 'password', username: 'testuser' };
      const expectedResponse = { message: 'User registered successfully' };

      jest.spyOn(userService, 'register').mockResolvedValue(expectedResponse);

      const result = await controller.inscrire(dto);
      expect(result).toEqual(expectedResponse);
      expect(userService.register).toHaveBeenCalledWith(dto);
    });

    it('devrait renvoyer une erreur si l’utilisateur existe déjà', async () => {
      const dto: RegisterDto = { email: 'test@example.com', password: 'password', username: 'testuser' };

      jest.spyOn(userService, 'register').mockRejectedValue(new BadRequestException('User already exists'));

      await expect(controller.inscrire(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const expectedResponse = { message: 'Login successful', token: 'fake-jwt-token' };

      jest.spyOn(userService, 'login').mockResolvedValue(expectedResponse);

      const result = await controller.connecter(dto);
      expect(result).toEqual(expectedResponse);
      expect(userService.login).toHaveBeenCalledWith(dto);
    });

    it('devrait renvoyer une erreur si les identifiants sont incorrects', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'wrongpassword' };

      jest.spyOn(userService, 'login').mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.connecter(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
