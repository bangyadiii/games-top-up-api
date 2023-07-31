import { Test, TestingModule } from '@nestjs/testing';
import { MidtransGateway } from './midtrans.gateway';

describe('MidtransGateway', () => {
  let gateway: MidtransGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MidtransGateway],
    }).compile();

    gateway = module.get<MidtransGateway>(MidtransGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
