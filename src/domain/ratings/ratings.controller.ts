import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { CurrentUser } from '../../auth/decorators/currentUser.decorator';
import { RequestUser } from '../../auth/interfaces/request-user.interface';
import { IdDto } from '../../common/dto/id.dto';
import { PaginationDto } from '../../quering/dto/pagination.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(
    @Body() createRatingDto: CreateRatingDto,
    @CurrentUser() user: RequestUser,
  ) {
    console.log('Rating controler....');
    return this.ratingsService.create(createRatingDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ratingsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.ratingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.ratingsService.remove(id);
  }
}
