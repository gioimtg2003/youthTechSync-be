import { ContextService } from '@common/modules/context';
import { ActionPermission, Policy, SEPARATOR_POLICY } from '@constants';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto, PermissionDto } from './dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly contextService: ContextService,
  ) {}

  async create(data: CreateRoleDto) {
    const { name, description } = data ?? {};
    const permissions = this.buildPermissions(data?.permissions ?? []);

    const role = this.roleRepository.create({
      name,
      description,
      permission: permissions,
      team: { id: this.contextService.getData('tenantId') },
    });

    await this.roleRepository.save(role);
    return true;
  }

  private buildPermissions(permissions: PermissionDto[]): Policy[] {
    const policyMap = new Map<string, Set<number>>();
    permissions?.forEach((permission) => {
      if (!permission?.resource || !permission?.actions) return;

      permission.actions.forEach((actionDto) => {
        if (!actionDto.action) return;

        const key = `${actionDto.action}${SEPARATOR_POLICY}${permission.resource}`;

        if (!policyMap.has(key)) {
          policyMap.set(key, new Set<number>());
        }
        const currentScopes = policyMap.get(key);

        if (Array.isArray(actionDto?.scope)) {
          actionDto?.scope?.forEach((s) => currentScopes.add(s));
        }
      });
    });

    return Array.from(policyMap.entries())?.map(([basePath, scopeSet]) => {
      const scopes = Array.from(scopeSet);
      const actionType = basePath.split(SEPARATOR_POLICY)[0];

      if (scopes.length === 0 || actionType === ActionPermission.create) {
        return basePath as Policy;
      }
      return `${basePath}${SEPARATOR_POLICY}${scopes.join(',')}` as Policy;
    });
  }

  async findAll(ids: number[] = []) {
    if (ids?.length > 0) {
      return this.roleRepository.find({
        where: {
          id: In(ids),
          team: { id: this.contextService.getData('tenantId') },
        },
        select: ['id', 'name', 'description'],
      });
    }
    return this.roleRepository.find({
      where: { team: { id: this.contextService.getData('tenantId') } },
      select: ['id', 'name', 'description'],
    });
  }
}
