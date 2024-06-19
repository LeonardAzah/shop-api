import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IdDto } from '../../common/dto/id.dto';
import { productsService } from './products.service';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/roles/enums/roles.enum';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { createParseFilePipe } from '../../files/util/file-validation.util';
import {
  MULTIPART_FORMDATA_KEY,
  MaxFileCount,
} from '../../files/util/file.constants';
import { FilesSchema } from '../../files/swagger/schemas/files.schema';
import { ProductsQueryDto } from './dto/quering/products-query.dto';
import { CloudinaryService } from '../../cloudinary/CloudinaryService';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: productsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() productsQueryDto: ProductsQueryDto) {
    return this.productsService.findAll(productsQueryDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.productsService.findOne(id);
  }

  @Roles(Role.MANAGER)
  @Patch(':id')
  update(@Param() { id }: IdDto, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(Role.MANAGER)
  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.productsService.remove(id);
  }

  @ApiConsumes(MULTIPART_FORMDATA_KEY)
  @ApiBody({ type: FilesSchema })
  @Roles(Role.MANAGER)
  @UseInterceptors(FilesInterceptor('files', MaxFileCount.PRODUCT_IMAGES))
  @Post('/images')
  async uploadImages(
    @UploadedFiles(createParseFilePipe('2MB', 'png', 'jpeg'))
    files: Express.Multer.File[],
  ) {
    const folder = process.env.CLOUDINARY_FOLDER_PRODUCTS;

    const result = await this.cloudinaryService.uploadFiles(files, folder);
    const urls = [];
    result.map((url) => urls.push(url.secure_url));
    return urls;
  }
}
