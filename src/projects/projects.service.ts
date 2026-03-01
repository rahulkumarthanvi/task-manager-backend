import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
  }

  async ensureProject(name: string, userId: string): Promise<Project> {
    const trimmedName = name.trim().replace(/\s+/g, ' ');
    const nameNormalized = this.normalizeName(trimmedName);
    const createdBy = new Types.ObjectId(userId);

    const existing = await this.projectModel
      .findOne({ createdBy, nameNormalized })
      .exec();

    if (existing) {
      return existing;
    }

    const created = new this.projectModel({
      name: trimmedName,
      nameNormalized,
      createdBy,
    });

    return created.save();
  }

  async findNames(userId: string, search?: string): Promise<string[]> {
    const createdBy = new Types.ObjectId(userId);
    const query: Record<string, unknown> = { createdBy };

    if (search?.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const projects = await this.projectModel
      .find(query)
      .sort({ name: 1 })
      .select({ name: 1 })
      .lean()
      .exec();

    return projects.map((project) => project.name);
  }
}
