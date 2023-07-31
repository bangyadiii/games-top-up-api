import { Test, TestingModule } from '@nestjs/testing';
import { MidtransService } from './midtrans.service';

describe('MidtransService', () => {
  let service: MidtransService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MidtransService],
    }).compile();

    service = module.get<MidtransService>(MidtransService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
