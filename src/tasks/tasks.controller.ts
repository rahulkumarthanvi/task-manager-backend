import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req: any) {
    const task = await this.tasksService.create(dto, req.user.userId);
    return {
      message: 'Task created successfully',
      data: task,
    };
  }

  @Get()
  findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('projectName') projectName?: string,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll(req.user.userId, {
      status: status as any,
      projectName: projectName || undefined,
      search: search || undefined,
    });
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.tasksService.getStats(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: any,
  ) {
    const task = await this.tasksService.updateStatus(
      id,
      dto.status,
      req.user.userId,
    );
    return {
      message: `Task marked as ${dto.status}`,
      data: task,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const task = await this.tasksService.update(id, dto, req.user.userId);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.tasksService.remove(id, req.user.userId);
    return {
      message: 'Task deleted successfully',
      data: null,
    };
  }
}
