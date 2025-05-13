import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './create-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/Decorator/get-user.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() project: CreateProjectDto, @GetUser("userId") userId: string) {
    return this.projectService.createProject(userId, project);
  }

  @Get()
  findAll() {
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.getProjectById(String(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.deleteProject(String(id));
  }
}
