import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, 
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('devrait inscrire un utilisateur avec succès', async () => {
      const dto = { email: 'test@example.com', username: 'testuser', password: 'password' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      
      const mockUser: User = {
        id: 1,
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        reservations: [], 
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.register(dto);
      expect(result).toEqual({ message: 'User registered successfully' });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('devrait lever une erreur si l’utilisateur existe déjà', async () => {
      const dto = { email: 'test@example.com', username: 'testuser', password: 'password' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        email: dto.email,
        username: dto.username,
        password: 'hashedpassword',
        reservations: [],
      } as User);

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      
      const mockUser: User = {
        id: 1,
        email: dto.email,
        username: 'testuser',
        password: hashedPassword,
        reservations: [], 
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(dto);
      expect(result).toEqual({ message: 'Login successful', token: 'fake-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('devrait lever une erreur si l’utilisateur n’existe pas', async () => {
      const dto = { email: 'notfound@example.com', password: 'password' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever une erreur si le mot de passe est incorrect', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('password', 10);
      
      const mockUser: User = {
        id: 1,
        email: dto.email,
        username: 'testuser',
        password: hashedPassword,
        reservations: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
