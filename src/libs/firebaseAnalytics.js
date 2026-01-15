import analytics, { logEvent as nativeLogEvent, logScreenView as nativeLogScreenView } from '@react-native-firebase/analytics';

const firebaseAnalytics = analytics();

export const logAnalyticsEvent = (eventName, params) => nativeLogEvent(firebaseAnalytics, eventName, params);

export const logAnalyticsScreenView = (params) => nativeLogScreenView(firebaseAnalytics, params);

export const logAnalyticsSearch = (searchTerm) =>
  nativeLogEvent(firebaseAnalytics, 'search', { search_term: searchTerm });

export default firebaseAnalytics;

