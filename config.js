module.exports = {
  heartbeatIntervalMs: 30000,
  deviceOfflineStateThresholdMs: 30000 * 1.5,
  notificationConditionCheckIntervalMin: 10,
  notificationConditions: {
    minOfflineDurationMs: 30000 * 1.5,
    minBatteryPercentage: 50,
    minPitchChange: 2,
    minRollChange: 2,
  },
};
