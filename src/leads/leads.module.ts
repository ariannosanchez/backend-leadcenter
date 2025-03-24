import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TenantModels } from 'src/providers/tenant-models.provider';
import { TenantMiddleware } from 'src/middlewares/tenant.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LeadsController],
  providers: [LeadsService, TenantModels.leadModel],
})
export class LeadsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes(LeadsController);
  }
}
