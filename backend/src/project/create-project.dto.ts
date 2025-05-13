import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name_project: string;



  @IsOptional()
  @IsUUID()
  api_key?: string;


}


