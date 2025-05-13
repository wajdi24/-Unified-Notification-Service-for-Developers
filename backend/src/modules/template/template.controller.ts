import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';  // Import the JWT Guard
import { TemplateService } from './template.service';  // Path may vary based on where the service is located
import { CreateTemplateDto } from './dto/create-template.dto';  // Adjust the path as needed
import { UpdateTemplateDto } from './dto/update-template.dto';  // Adjust the path as needed
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/Decorator/get-user.decorator';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

   @UseGuards(JwtAuthGuard) // Protect this route
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto,
    @GetUser('userId') userId: string,
) {
    return this.templateService.create(createTemplateDto,userId);
  }

   @UseGuards(JwtAuthGuard) // Protect this route
  @Get()
  findAll() {
    return this.templateService.findAll();
  }

   @UseGuards(JwtAuthGuard) // Protect this route
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

   @UseGuards(JwtAuthGuard) // Protect this route
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(id, updateTemplateDto);
  }

   @UseGuards(JwtAuthGuard) // Protect this route
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
