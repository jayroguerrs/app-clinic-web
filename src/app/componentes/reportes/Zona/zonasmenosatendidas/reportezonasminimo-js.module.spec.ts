import { ZonaMinimoReportesModule } from './reportezonasminimo.module';

describe('CrtChartJsModule', () => {
  let crtChartJsModule: ZonaMinimoReportesModule;

  beforeEach(() => {
    crtChartJsModule = new ZonaMinimoReportesModule();
  });

  it('should create an instance', () => {
    expect(crtChartJsModule).toBeTruthy();
  });
});
