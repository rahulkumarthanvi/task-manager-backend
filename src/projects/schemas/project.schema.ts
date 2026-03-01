import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true, index: true })
  nameNormalized!: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  createdBy!: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ createdBy: 1, nameNormalized: 1 }, { unique: true });
