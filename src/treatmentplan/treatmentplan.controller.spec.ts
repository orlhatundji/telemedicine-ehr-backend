import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentPlanController } from './treatmentplan.controller';
import { TreatmentPlanService } from './treatmentplan.service';

describe('TreamentplanController', () => {
  let controller: TreamentplanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentPlanController],
      providers: [TreatmentPlanService],
    }).compile();

    controller = module.get<TreatmentPlanController>(TreatmentPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
