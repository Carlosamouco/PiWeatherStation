export class ForecastUtils {

  private static regions: number[] = [
    3430100, //Angra do Heroísmo
    3470100, //Horta
    3430121, //Lajes
    3420300, //Ponta delgada
    2310800, //Santa Cruz
    3410100, //Vila do Porto
    3420200, //Nordeste
    3440100, //Santa Cruz da Graciosa
    3450200, //Velas
    3460200, //Madalena
    3480200, //Santa Cruz das Flores
    3490100, //Vila do Corvo
];

  private static mainland: any[] = [
    {'start':8, 'end':17},
    {'start':8, 'end':18},
    {'start':7, 'end':18},
    {'start':7, 'end':20},
    {'start':7, 'end':20},
    {'start':6, 'end':21},
    {'start':6, 'end':21},
    {'start':7, 'end':21},
    {'start':7, 'end':20},
    {'start':8, 'end':19},
    {'start':7, 'end':18},
    {'start':8, 'end':17},
  ];

  private static inslands: any[] = [
    {'start':8, 'end':18},
    {'start':8, 'end':18},
    {'start':7, 'end':19},
    {'start':7, 'end':20},
    {'start':7, 'end':21},
    {'start':6, 'end':21},
    {'start':6, 'end':21},
    {'start':7, 'end':21},
    {'start':7, 'end':20},
    {'start':8, 'end':19},
    {'start':7, 'end':18},
    {'start':8, 'end':17}
  ];

  public static isDay(date: Date, region: number): boolean {
    const m = date.getMonth();
    let array;

    if (this.regions.includes(region)) {
      array = this.inslands;
    }
    else {
      array = this.mainland;
    }

    let h = date.getUTCHours();

    if(h < array[m].end && h >= array[m].start) {
      return true;
    }
    else {
      return false;
    }
  }
}
