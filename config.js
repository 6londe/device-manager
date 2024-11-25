module.exports = {
  heartbeatIntervalMs: 60000,
  deviceOfflineStateThresholdMs: 60000 * 2,
  notificationConditionCheckIntervalMin: 5,
  notificationConditions: {
    minOfflineDurationMs: 60000 * 2,
    minBatteryPercentage: 20,
  },
};
