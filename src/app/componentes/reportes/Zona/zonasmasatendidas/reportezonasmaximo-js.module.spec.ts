import { ZonaMaximoReportesModule } from './reportezonasmaximo.module';

describe('CrtChartJsModule', () => {
  let crtChartJsModule: ZonaMaximoReportesModule;

  beforeEach(() => {
    crtChartJsModule = new ZonaMaximoReportesModule();
  });

  it('should create an instance', () => {
    expect(crtChartJsModule).toBeTruthy();
  });
});
