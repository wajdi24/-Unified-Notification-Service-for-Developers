import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) { }

  async createProject(userId: string, project: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        nameProject: project.name_project,
        apiKey: project.api_key,
        userId,

      },
    });

  }


  async getAllProjects() {
    return this.prisma.project.findMany();
  }

  async getProjectById(id: string) { // ✅ FIXED: ID is probably UUID string
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async deleteProject(id: string) { // ✅ FIXED: ID is probably UUID string
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
