import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Secret extends Document {
    @Prop({ required: true })
    jwtSecret: string
}

export const SecretSchema = SchemaFactory.createForClass(Secret);