import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  projectName!: string;

  @IsNotEmpty()
  @IsString()
  taskTitle!: string;

  @IsOptional()
  @IsString()
  taskDetails?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  estTime?: string;

  @IsOptional()
  @IsString()
  loggedTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['High', 'Medium', 'Low'])
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(['Pending', 'In Progress', 'Blocked', 'Completed'])
  status?: TaskStatus;
}

