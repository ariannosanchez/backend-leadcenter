import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id']?.toString();

    if (!tenantId) {
      throw new BadRequestException('X-TENANT-ID not provided or invalid');
    }

    try {
      const tenantExits = await this.tenantService.findOne(tenantId);
      if (!tenantExits) {
        throw new NotFoundException('Tenant not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Database error');
    }

    req['tenantId'] = tenantId;
    next();
  }
}
