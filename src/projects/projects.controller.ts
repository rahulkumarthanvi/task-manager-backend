import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Req() req: any, @Query('search') search?: string) {
    return this.projectsService.findNames(req.user.userId, search);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectDto) {
    const project = await this.projectsService.ensureProject(
      dto.name,
      req.user.userId,
    );

    return {
      message: 'Project saved successfully',
      data: {
        id: project.id,
        name: project.name,
      },
    };
  }
}
