import { useState, useEffect } from "react";
import { AppSettings } from "../types";
import {
  loadSettings,
  saveSettings as saveSettingsToStorage,
} from "../utils/storage";

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  useEffect(() => {
    // Load settings on mount
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettingsToStorage(updatedSettings);
  };

  return {
    settings,
    updateSettings,
  };
};
