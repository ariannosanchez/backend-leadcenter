import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<Tenant>) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantModel.create(createTenantDto);
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

  async remove(id: string): Promise<void>{
    const result = await this.tenantModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Tenant not found');
    }
  }
}
