'use client';

import { useEffect, useState } from 'react';

function DeviceDashboard() {
  const REFRESH_INTERVAL_MS = 60000;
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    const response = await fetch('/api/devices');
    const data = await response.json();
    setDevices(data);
  };

  useEffect(() => {
    fetchDevices();

    const interval = setInterval(() => {
      fetchDevices();
    }, REFRESH_INTERVAL_MS);

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
