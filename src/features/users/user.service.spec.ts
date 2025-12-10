import { CryptoService } from '@features/crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('User service', () => {
  let service: UserService;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockCryptoService = {
    hash: jest.fn(),
    comparePassword: jest.fn(),
    // thêm các hàm khác nếu UserService có dùng
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User), // Khi UserService xin UserRepository
          useValue: mockUserRepository, // Thì đưa cho nó cái object giả này
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userData = {
      username: 'testuser',
      email: 'bOa0f@example.com',
      password: 'password123',
    };

    const hashedPassword = 'hashedPassword123';
    mockCryptoService.hash.mockResolvedValue(hashedPassword);
    const createdUser = {
      id: 1,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    };
    mockUserRepository.create.mockReturnValue(createdUser);
    mockUserRepository.save.mockResolvedValue(createdUser);
    const result = await service.create(userData);
    expect(result).toEqual(createdUser);
  });
});
