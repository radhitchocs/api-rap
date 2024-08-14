import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreateStockOpnameDto } from '../dto/create-stock-opname.dto';
import { GetStockOpnameDto } from '../dto/get-stock-opname.dto';
import { StockOpnamesService } from '../service/stock-opnames.service';

@Controller('stock-opnames')
export class StockOpnamesController {
  constructor(private readonly stockOpnamesService: StockOpnamesService) {}

  @Get()
  @ResponseMessage('Successfully retrieved stock opnames!')
  async get(@Query() dto: GetStockOpnameDto) {
    const result = await this.stockOpnamesService.get(dto);
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully retrieved stock opname details!')
  async getById(@Param('id') id: string) {
    const result = await this.stockOpnamesService.getById(
      new Types.ObjectId(id),
    );
    return result;
  }

  @Post()
  @ResponseMessage('Stock opname has been created successfully.')
  async create(@Body() dto: CreateStockOpnameDto) {
    const result = await this.stockOpnamesService.create(dto);
    return result;
  }

  @Patch('/:id')
  @ResponseMessage('Stock opname has been updated successfully.')
  async update(@Param('id') id: string, @Body() dto: CreateStockOpnameDto) {
    return this.stockOpnamesService.update(new Types.ObjectId(id), dto);
  }

  @Delete('/:id')
  @ResponseMessage('Stock opname has been deleted successfully.')
  async delete(@Param('id') id: string) {
    return this.stockOpnamesService.delete(new Types.ObjectId(id));
  }
}
