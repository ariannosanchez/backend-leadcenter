import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './entities/tenant.entity';
import { UsersService } from 'src/users/users.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { nanoid } from 'nanoid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TenantsService {
  constructor(@InjectModel(Tenant.name)
  private tenantModel: Model<Tenant>,
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantModel.create(createTenantDto);
  }

  async createCompany(createTenantDto: CreateTenantDto) {
    //Verify user does not alredy exist
    const user = await this.usersService.getUserByEmail(createTenantDto.user.email);
    if (user) {
      throw new BadRequestException('User exists and belongs to a company');
    }
    //Create a tenant id
    const tenantId = nanoid(12);

    //Create a tenant secret
    await this.authService.createSecretKeyForNewTenant(tenantId);

    //Create mew user
    await this.usersService.createUser(createTenantDto.user, tenantId);

    //Create Tenant Record
    return this.tenantModel.create({
      companyName: createTenantDto.companyName,
      tenantId,
    });

  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findOne(tenantId: string): Promise<Tenant> {
    return this.tenantModel.findOne({ tenantId })
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Tenant not found');
    }
  }
}
