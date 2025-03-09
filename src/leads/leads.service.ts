import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROVIDER } from 'src/constants/providers';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  
  constructor(@Inject(PROVIDER.LEAD_MODEL) private leadModel: Model<Lead>) {}
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    return await this.leadModel.create(createLeadDto);
  }

  async findAll() {
    return await this.leadModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
