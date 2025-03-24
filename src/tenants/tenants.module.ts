import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantController } from './tenants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './entities/tenant.entity';
import { TenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [
    UsersModule,
    AuthModule,
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
