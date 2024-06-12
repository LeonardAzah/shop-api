import { IntersectionType } from '@nestjs/swagger';
import { FilenameDto } from './filename.dto';
import { IdDto } from '../../common/dto/id.dto';

export class IdFilenameDto extends IntersectionType(IdDto, FilenameDto) {}
