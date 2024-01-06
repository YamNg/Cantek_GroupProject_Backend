export interface IAnalyticsEvent extends Document {
  userId: string;
  eventType: string;
  eventValue: string;
}
