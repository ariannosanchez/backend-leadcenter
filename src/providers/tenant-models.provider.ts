import { Connection } from 'mongoose';
import { PROVIDER } from 'src/constants/providers';
import { Lead, LeadSchema } from 'src/leads/entities/lead.entity';

export const TenantModels = {
  leadModel: {
    provide: PROVIDER.LEAD_MODEL,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Lead.name, LeadSchema);
    },
    inject: [PROVIDER.TENANT_CONNECTION],
  },
};
