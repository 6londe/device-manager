export default {
  heartbeatIntervalMs: 60000,
  deviceOfflineStateThresholdMs: 60000 * 2,
  notificationConditionCheckIntervalMin: 1,
  notificationConditions: {
    minOfflineDurationMs: 6000 * 2,
    minBatteryPercentage: 20,
  },
};
