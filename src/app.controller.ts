import { Controller, Get, Query } from '@nestjs/common';
import { ReadService } from './read.service';
import { ReportService } from './report.service';

@Controller()
export class AppController {
  constructor(
    private readonly readService: ReadService,
    private readonly reportService: ReportService,
  ) {}

  @Get('report')
  async report() {
    const file = await this.readService.read();

    const report = await this.reportService.generate(file);

    return report;
  }

  @Get('ranking')
  async ranking(@Query('order') order: string) {
    const file = await this.readService.read();

    const report = await this.reportService.ranking(file, order);

    return report;
  }
}
