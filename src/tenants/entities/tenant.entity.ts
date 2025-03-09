import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Tenant extends Document {

    @Prop({ required: true, unique: true })
    companyName: string;

    @Prop({ required: true, unique: true })
    tenantId: string;

    @Prop({ required: true, default: true })
    isActive: boolean;

}

export const TenantSchema = SchemaFactory.createForClass( Tenant );