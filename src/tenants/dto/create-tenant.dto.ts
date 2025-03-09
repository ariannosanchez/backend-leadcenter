import { IsNotEmpty, IsString } from "class-validator";

export class CreateTenantDto {
    
    @IsNotEmpty()
    @IsString()
    companyName: string;

    @IsNotEmpty()
    @IsString()
    tenantId: string;
}
