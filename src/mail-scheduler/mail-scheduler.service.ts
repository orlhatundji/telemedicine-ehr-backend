import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class MailSchedulerService {
  private readonly logger = new Logger(MailSchedulerService.name);
  constructor(private appointmentService: AppointmentService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Sending reminder emails...');
  }
}
