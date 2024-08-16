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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':id')
  create(
    @Param() { id }: IdDto,
    @Body() createRatingDto: CreateRatingDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ratingsService.create(id, createRatingDto, user.id);
  }

  @Get(':id')
  findAll(@Param() { id }: IdDto, @Query() paginationDto: PaginationDto) {
    return this.ratingsService.getProductRatings(id, paginationDto);
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
