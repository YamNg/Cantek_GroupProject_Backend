export interface IAnalyticsConstants {
  [type: string]: {
    eventType: string;
    eventValues: {
      [valueKey: string]: string;
    };
  };
}
