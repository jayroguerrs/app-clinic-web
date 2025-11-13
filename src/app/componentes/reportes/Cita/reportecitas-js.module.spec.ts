import { ReporteCitaModule } from './reportecitas.module';

describe('CrtChartJsModule', () => {
  let crtChartJsModule: ReporteCitaModule;

  beforeEach(() => {
    crtChartJsModule = new ReporteCitaModule();
  });

  it('should create an instance', () => {
    expect(crtChartJsModule).toBeTruthy();
  });
});
