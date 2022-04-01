import { AppService } from '../src/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get health', async () => {
    expect(service.getHealth()).toStrictEqual({
      success: true,
      message: "Hello there! I'm OK!",
    });
  });
});
