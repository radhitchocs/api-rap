import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../service/analytics.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('')
  getAnalytics() {
    return this.analyticsService.getAnalyticsDashboard();
  }

  @Get('top-frequently-bought-products')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopFrequentlyBoughtProducts(@Query('limit') limit: number = 5) {
    return this.analyticsService.getTopFrequentlyBoughtProducts(limit);
  }

  @Get('top-products-by-quantity')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopProductsByQuantity(@Query('limit') limit: number = 5) {
    const topProducts =
      await this.analyticsService.getTopFrequentlyOrderedProductsByQuantity(
        limit,
      );
    return topProducts;
  }

  @Get('total-revenue')
  async getTotalRevenue() {
    return this.analyticsService.getTotalRevenue();
  }

  @Get('profit-growth')
  async getProfitGrowth() {
    return this.analyticsService.getProfitGrowth();
  }
}
