import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority, TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsNotEmpty()
  @IsString()
  projectName!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsNotEmpty()
  @IsString()
  taskTitle!: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  taskDetails?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  estTime?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  loggedTime?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
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
