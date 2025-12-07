'use client';

import { Wifi, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { QRContentData, WiFiContent } from '@/types/qr-content';

interface WiFiFormProps {
  content: QRContentData;
  onChange: <T extends QRContentData>(updates: Partial<T>) => void;
}

export function WiFiForm({ content, onChange }: WiFiFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const wifi = content as WiFiContent;

  const handleChange = (updates: Partial<WiFiContent>) => {
    onChange<WiFiContent>(updates);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950 mb-4">
          <Wifi className="w-8 h-8 text-cyan-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Wi-Fi Connection
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Let guests connect to your Wi-Fi with one scan
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Network Name (SSID) *
          </label>
          <input
            type="text"
            value={wifi.ssid}
            onChange={(e) => handleChange({ ssid: e.target.value })}
            placeholder="My WiFi Network"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={wifi.password}
              onChange={(e) => handleChange({ password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Security Type
          </label>
          <select
            value={wifi.securityType}
            onChange={(e) =>
              handleChange({
                securityType: e.target.value as WiFiContent['securityType'],
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="WPA2">WPA/WPA2</option>
            <option value="WPA">WPA</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No Password</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="hidden"
            checked={wifi.isHidden}
            onChange={(e) => handleChange({ isHidden: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="hidden"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Hidden network (SSID not broadcast)
          </label>
        </div>
      </div>
    </div>
  );
}
