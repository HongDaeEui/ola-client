import { IsBoolean, IsISO8601, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetupDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsISO8601()
  date: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isVirtual?: boolean;

  @IsOptional()
  @IsString()
  referenceLabId?: string;

  @IsOptional()
  @IsNumber()
  @Min(2)
  maxParticipants?: number;
}
