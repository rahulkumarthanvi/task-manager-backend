import { IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskStatusDto {
  @IsEnum(['Pending', 'In Progress', 'Blocked', 'Completed'])
  status!: TaskStatus;
}
