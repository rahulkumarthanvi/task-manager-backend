import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TaskStatus = 'Pending' | 'In Progress' | 'Blocked' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, unique: true })
  taskId!: string;

  @Prop({ required: true, index: true })
  projectName!: string;

  @Prop({ required: true })
  taskTitle!: string;

  @Prop()
  taskDetails?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  assignee?: Types.ObjectId;

  @Prop({ type: Date })
  assignedDate?: Date;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ required: true, enum: ['High', 'Medium', 'Low'], default: 'Medium' })
  priority!: TaskPriority;

  @Prop({
    required: true,
    enum: ['Pending', 'In Progress', 'Blocked', 'Completed'],
    default: 'Pending',
  })
  status!: TaskStatus;

  @Prop()
  estTime?: string;

  @Prop()
  loggedTime?: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

