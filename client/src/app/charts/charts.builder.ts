export abstract class ChartsBuilder {
  protected labels: string[];
  protected datasets: any = { };
  
  public getDatasets() {
    return this.datasets;
  }

  public getLabels() {
    return this.labels;
  }

  public abstract build(hData: any[]);
}
