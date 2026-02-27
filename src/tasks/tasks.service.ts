import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  private async generateTaskId(projectName: string): Promise<string> {
    const prefix = projectName.trim().toUpperCase().replace(/\s+/g, '-');
    const lastTask = await this.taskModel
      .findOne({ projectName })
      .sort({ createdAt: -1 })
      .exec();

    if (!lastTask || !lastTask.taskId) {
      return `${prefix}-001`;
    }

    const parts = lastTask.taskId.split('-');
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    const base = parts.slice(0, -1).join('-') || prefix;

    return `${base}-${nextNumber}`;
  }

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const taskId = await this.generateTaskId(dto.projectName);
    const now = new Date();

    const created = new this.taskModel({
      ...dto,
      taskId,
      createdBy: new Types.ObjectId(userId),
      assignedDate: now,
      assignee: new Types.ObjectId(userId),
    });

    return created.save();
  }

  async findAll(
    userId: string,
    filters: { status?: TaskStatus; projectName?: string; search?: string },
  ): Promise<Task[]> {
    const query: Record<string, unknown> = {
      createdBy: new Types.ObjectId(userId),
    };

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = { $ne: 'Completed' };
    }

    if (filters.projectName) {
      query.projectName = filters.projectName;
    }

    if (filters.search) {
      query.taskTitle = { $regex: filters.search, $options: 'i' };
    }

    return this.taskModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel
      .findOne({ _id: id, createdBy: userId })
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, createdBy: userId }, dto, {
        new: true,
      })
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    const res = await this.taskModel
      .findOneAndDelete({ _id: id, createdBy: userId })
      .exec();
    if (!res) {
      throw new NotFoundException('Task not found');
    }
  }

  async getStats(userId: string) {
    const createdBy = new Types.ObjectId(userId);

    const [incompleteCount, completedCount] = await Promise.all([
      this.taskModel
        .countDocuments({
          createdBy,
          status: { $ne: 'Completed' },
        })
        .exec(),
      this.taskModel
        .countDocuments({
          createdBy,
          status: 'Completed',
        })
        .exec(),
    ]);

    return {
      incompleteCount,
      completedCount,
    };
  }
}

