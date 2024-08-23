import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from 'src/appointment/appointment.service';
import { mailClient } from './mail-client.js';

@Injectable()
export class MailSchedulerService {
  private readonly logger = new Logger(MailSchedulerService.name);
  constructor(private appointmentService: AppointmentService) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleCron() {
    this.logger.debug('Sending reminder emails...');
    const appointments = await this.appointmentService.findAllToday();
    appointments.forEach(({ doctor, date, patient }) => {
      mailClient({
        date: date,
        email: patient.user.email,
        doctor: doctor.user.name,
        recipient: patient.user.name,
      });
    });
  }
}
