import { MailService } from '@common/services/mail';
import { TeamError, UserError } from '@constants';
import { CryptoService } from '@features/crypto';
import { User } from '@features/users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TeamInvite } from './entities/team-invite.entity';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

describe('TeamService - Invite functionality', () => {
  let service: TeamService;

  const mockTeamRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTeamInviteRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockCryptoService = {
    generateToken: jest.fn(),
  };

  const mockMailService = {
    sendInviteEmail: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    manager: {
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: getRepositoryToken(TeamInvite),
          useValue: mockTeamInviteRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvite', () => {
    it('should create an invite successfully', async () => {
      const teamId = 1;
      const userId = 1;
      const email = 'test@example.com';
      const token = 'test-token-123';

      const mockTeam = {
        id: teamId,
        name: 'Test Team',
      };

      const mockUser = {
        id: userId,
        email: 'inviter@example.com',
      };

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockDataSource.manager.findOne.mockResolvedValue(mockUser);
      mockCryptoService.generateToken.mockReturnValue('test-token');
      mockTeamInviteRepository.create.mockReturnValue({
        token,
        teamId,
        invitedBy: userId,
        email,
      });
      mockTeamInviteRepository.save.mockResolvedValue({ id: 1 });
      mockMailService.sendInviteEmail.mockResolvedValue(true);

      const result = await service.createInvite(teamId, userId, email);

      expect(result).toContain('/invites/');
      expect(mockMailService.sendInviteEmail).toHaveBeenCalledWith(
        email,
        mockUser.email,
        mockTeam.name,
        expect.stringContaining('/invites/'),
      );
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.createInvite(1, 1, 'test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockTeam = { id: 1, name: 'Test Team' };
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockDataSource.manager.findOne.mockResolvedValue(null);

      await expect(service.createInvite(1, 1, 'test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not send email when email is not provided', async () => {
      const teamId = 1;
      const userId = 1;

      const mockTeam = { id: teamId, name: 'Test Team' };
      const mockUser = { id: userId, email: 'inviter@example.com' };

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockDataSource.manager.findOne.mockResolvedValue(mockUser);
      mockCryptoService.generateToken.mockReturnValue('test-token');
      mockTeamInviteRepository.create.mockReturnValue({
        token: 'test-token',
        teamId,
        invitedBy: userId,
      });
      mockTeamInviteRepository.save.mockResolvedValue({ id: 1 });

      await service.createInvite(teamId, userId);

      expect(mockMailService.sendInviteEmail).not.toHaveBeenCalled();
    });
  });

  describe('getInviteByToken', () => {
    it('should return invite when valid', async () => {
      const token = 'valid-token';
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const mockInvite = {
        id: 1,
        token,
        teamId: 1,
        invitedBy: 1,
        expiresAt: futureDate,
        usedAt: null,
        team: { id: 1, name: 'Test Team' },
        inviter: { id: 1, email: 'inviter@example.com' },
      };

      mockTeamInviteRepository.findOne.mockResolvedValue(mockInvite);

      const result = await service.getInviteByToken(token);

      expect(result).toEqual(mockInvite);
    });

    it('should throw NotFoundException when invite not found', async () => {
      mockTeamInviteRepository.findOne.mockResolvedValue(null);

      await expect(service.getInviteByToken('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when invite already used', async () => {
      const mockInvite = {
        token: 'used-token',
        usedAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
      };

      mockTeamInviteRepository.findOne.mockResolvedValue(mockInvite);

      await expect(service.getInviteByToken('used-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when invite expired', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const mockInvite = {
        token: 'expired-token',
        usedAt: null,
        expiresAt: pastDate,
      };

      mockTeamInviteRepository.findOne.mockResolvedValue(mockInvite);

      await expect(service.getInviteByToken('expired-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('markInviteAsUsed', () => {
    it('should mark invite as used', async () => {
      const token = 'test-token';
      mockTeamInviteRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.markInviteAsUsed(token);

      expect(result).toBe(true);
      expect(mockTeamInviteRepository.update).toHaveBeenCalledWith(
        { token },
        { usedAt: expect.any(Date) },
      );
    });

    it('should return false when invite not found', async () => {
      mockTeamInviteRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.markInviteAsUsed('invalid-token');

      expect(result).toBe(false);
    });
  });
});
