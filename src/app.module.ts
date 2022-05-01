import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ReadService } from './read.service';
import { ReportService } from './report.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ReadService, ReportService],
})
export class AppModule {}
