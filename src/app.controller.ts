import { Controller, Get, Query } from '@nestjs/common';
import { ReadService } from './read.service';
import { ReportService } from './report.service';

@Controller('reports')
export class AppController {
  constructor(
    private readonly readService: ReadService,
    private readonly reportService: ReportService,
  ) {}

  @Get()
  async report() {
    const file = await this.readService.read();

    const report = await this.reportService.mainReport(file);

    return report;
  }

  @Get('ranking')
  async ranking(@Query('order') order: string) {
    const file = await this.readService.read();

    const report = await this.reportService.rankingReport(file, order);

    return report;
  }

  @Get('deaths')
  async deaths() {
    const file = await this.readService.read();

    const report = await this.reportService.deathReport(file);

    return report;
  }
}
