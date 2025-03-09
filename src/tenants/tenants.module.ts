import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './entities/tenant.entity';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      }
    ])
  ],
  controllers: [TenantController],
  providers: [TenantsService, TenantConnectionProvider],
  exports: [TenantsService, TenantConnectionProvider]
})
export class TenantModule {}
