import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { ResponseMessage } from 'src/decorator/response.decorator';

import { CreateStockOpnameDto } from '../dto/create-stock-opname.dto';
import { GetStockOpnameDto } from '../dto/get-stock-opname.dto';
import { StockOpnamesService } from '../service/stock-opnames.service';

@Controller('stock-opnames')
export class StockOpnamesController {
  constructor(private readonly stockOpnamesService: StockOpnamesService) {}

  @Post()
  @ResponseMessage('Stock opname has been created successfully.')
  async create(@Body() dto: CreateStockOpnameDto) {
    const result = await this.stockOpnamesService.create(dto);
    return result;
  }

  @Get()
  @ResponseMessage('Successfully get stock opnames!')
  async get(@Query() dto: GetStockOpnameDto) {
    const result = await this.stockOpnamesService.get(dto);
    return result;
  }

  @Get('/:id')
  @ResponseMessage('Successfully get stock opname details!')
  async getById(@Param('id') id: string) {
    const result = await this.stockOpnamesService.getById(
      new Types.ObjectId(id),
    );
    return result;
  }
}
