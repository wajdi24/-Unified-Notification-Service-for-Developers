import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from '@prisma/client';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTemplateDto: CreateTemplateDto,userId:string):Promise<Template> {
    const template = await this.prisma.template.create({
      data: {...createTemplateDto,userId},
    });
    return template;
  }

  async findAll() {
    return this.prisma.template.findMany();
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto):Promise<Template> {
    const template = await this.findOne(id);
    const res= await this.prisma.template.update({
      where:{
        id:template.id
      },
      data:{
        body: updateTemplateDto.body,
        type:updateTemplateDto.type,

      },

    });
    return res;
  }

  async remove(id: string) {
    await this.findOne(id); 
    return this.prisma.template.delete({
      where: { id },
    });
  }
}
