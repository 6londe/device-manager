'use client';

import { useEffect, useState } from 'react';
import config from '../config';

function DeviceDashboard() {
  const [devices, setDevices] = useState<any[]>([]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices');
      const data = await response.json();
      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
    }
  };

  useEffect(() => {
    fetchDevices();

    const interval = setInterval(() => {
      fetchDevices();
    }, config.heartbeatIntervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Devices</h1>
      <table>
        <thead>
          <tr>
            <th style={headerCellStyle}>Nickname</th>
            <th style={headerCellStyle}>Device Key</th>
            <th style={headerCellStyle}>Status</th>
            <th style={headerCellStyle}>Timestamp</th>
            <th style={headerCellStyle}>Tilt</th>
            <th style={headerCellStyle}>Battery Percentage</th>
            <th style={headerCellStyle}>Charging</th>
            <th style={headerCellStyle}>Current Screen</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device: any) => (
            <tr key={device.deviceKey}>
              <td style={cellStyle}>{device.nickname}</td>
              <td style={cellStyle}>{device.deviceKey}</td>
              <td style={cellStyle}>{device.status}</td>
              <td style={cellStyle}>
                {device.lastHeartbeatDetails
                  ? device.lastHeartbeatDetails.timestamp
                  : 'N/A'}
              </td>
              <td style={cellStyle}>
                {device.lastHeartbeatDetails
                  ? device.lastHeartbeatDetails.tilt
                  : 'N/A'}
              </td>
              <td style={cellStyle}>
                {device.lastHeartbeatDetails
                  ? device.lastHeartbeatDetails.batteryPercentage
                  : 'N/A'}
              </td>
              <td style={cellStyle}>
                {device.lastHeartbeatDetails
                  ? device.lastHeartbeatDetails.isCharging
                    ? 'Yes'
                    : 'No'
                  : 'N/A'}
              </td>
              <td style={cellStyle}>
                {device.lastHeartbeatDetails
                  ? device.lastHeartbeatDetails.currentScreen
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerCellStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  backgroundColor: '#f4f4f4',
};

const cellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default DeviceDashboard;
