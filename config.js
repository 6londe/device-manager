module.exports = {
  heartbeatIntervalMs: 30000,
  deviceOfflineStateThresholdMs: 30000 * 2,
  notificationConditionCheckIntervalMin: 5,
  notificationConditions: {
    minOfflineDurationMs: 30000 * 2,
    minBatteryPercentage: 20,
  },
};
