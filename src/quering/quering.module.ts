import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { FilteringService } from './filtering.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService, FilteringService],
})
export class QueringModule {}
