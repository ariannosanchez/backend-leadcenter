import { InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PROVIDER } from 'src/constants/providers';

export const TenantConnectionProvider = {
  provide: PROVIDER.TENANT_CONNECTION,
  useFactory: async (request, connection: Connection) => {
    if (!request.tenantId) {
      throw new InternalServerErrorException(
        'Make sure to use the TenantMiddleware to set the tenantId in the request.',
      );
    }
    return connection.useDb(`tenant_${request.tenantId}`);
  },
  inject: [REQUEST, getConnectionToken()],
};
