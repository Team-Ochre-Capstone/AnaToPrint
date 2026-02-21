import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  saveToSession,
  getFromSession,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from "../storage";

describe("Storage Utils", () => {
  const STORAGE_PREFIX = "ct-app-";

  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe("saveToSession", () => {
    it("should save a string value to session storage", () => {
      const key = "testKey";
      const value = "testValue";

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should save a number value to session storage", () => {
      const key = "numberKey";
      const value = 42;

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should save a boolean value to session storage", () => {
      const key = "boolKey";
      const value = true;

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should save an object to session storage", () => {
      const key = "objKey";
      const value = { name: "test", age: 25 };

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should save an array to session storage", () => {
      const key = "arrayKey";
      const value = [1, 2, 3, "four"];

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should save null value to session storage", () => {
      const key = "nullKey";
      const value = null;

      saveToSession(key, value);

      const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      expect(stored).toBe(JSON.stringify(value));
    });

    it("should apply the correct prefix to the key", () => {
      const key = "myKey";
      const value = "myValue";

      saveToSession(key, value);

      expect(sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)).toBeDefined();
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    it("should handle save errors gracefully without throwing", () => {
      const setItemSpy = vi.spyOn(sessionStorage, "setItem");

      setItemSpy.mockImplementationOnce(() => {
        throw new Error("Storage quota exceeded");
      });

      // Main behavior: function should not throw when setItem fails
      expect(() => saveToSession("key", "value")).not.toThrow();

      setItemSpy.mockRestore();
    });

    it("should overwrite existing key", () => {
      const key = "overwriteKey";

      saveToSession(key, "first");
      expect(getFromSession<string>(key)).toBe("first");

      saveToSession(key, "second");
      expect(getFromSession<string>(key)).toBe("second");
    });
  });

  describe("getFromSession", () => {
    it("should retrieve a previously saved string value", () => {
      const key = "stringKey";
      const value = "test string";

      saveToSession(key, value);
      const retrieved = getFromSession<string>(key);

      expect(retrieved).toBe(value);
    });

    it("should retrieve a previously saved object", () => {
      const key = "objKey";
      const value = { user: "john", age: 30 };

      saveToSession(key, value);
      const retrieved = getFromSession<typeof value>(key);

      expect(retrieved).toEqual(value);
    });

    it("should retrieve a previously saved array", () => {
      const key = "arrayKey";
      const value = [1, 2, 3];

      saveToSession(key, value);
      const retrieved = getFromSession<number[]>(key);

      expect(retrieved).toEqual(value);
    });

    it("should return null if key does not exist", () => {
      const retrieved = getFromSession<string>("nonexistent");

      expect(retrieved).toBeNull();
    });

    it("should apply the correct prefix when retrieving", () => {
      const key = "myKey";
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify("data"));

      const retrieved = getFromSession<string>(key);

      expect(retrieved).toBe("data");
    });

    it("should handle malformed JSON gracefully", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");
      const key = "badJsonKey";

      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, "not valid json {");

      const retrieved = getFromSession<any>(key);

      expect(retrieved).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Could not read from session storage:",
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle read errors gracefully", () => {
      const getItemSpy = vi.spyOn(sessionStorage, "getItem");

      getItemSpy.mockImplementationOnce(() => {
        throw new Error("Storage access denied");
      });

      // Main behavior: function should return null when getItem fails
      const retrieved = getFromSession<any>("key");
      expect(retrieved).toBeNull();

      getItemSpy.mockRestore();
    });

    it("should preserve data type through JSON roundtrip", () => {
      const key = "typeKey";
      const value = {
        string: "text",
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3],
      };

      saveToSession(key, value);
      const retrieved = getFromSession<typeof value>(key);

      expect(retrieved).toEqual(value);
      expect(typeof retrieved?.string).toBe("string");
      expect(typeof retrieved?.number).toBe("number");
      expect(typeof retrieved?.boolean).toBe("boolean");
      expect(retrieved?.null).toBeNull();
      expect(Array.isArray(retrieved?.array)).toBe(true);
    });
  });

  describe("loadSettings", () => {
    it("should return DEFAULT_SETTINGS when storage is empty", () => {
      const settings = loadSettings();

      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it("should return merged settings when partial settings are saved", () => {
      const partialSettings = { renderQuality: "low" as const };

      saveToSession("settings", partialSettings);
      const settings = loadSettings();

      expect(settings.renderQuality).toBe("low");
      expect(settings.backgroundColor).toBe(DEFAULT_SETTINGS.backgroundColor);
      expect(settings.showGrid).toBe(DEFAULT_SETTINGS.showGrid);
      expect(settings.autoOptimize).toBe(DEFAULT_SETTINGS.autoOptimize);
      expect(settings.defaultExport).toBe(DEFAULT_SETTINGS.defaultExport);
    });

    it("should prefer saved settings over defaults", () => {
      const savedSettings = {
        renderQuality: "medium" as const,
        backgroundColor: "dark-gray" as const,
        showGrid: false,
        autoOptimize: false,
        defaultExport: "obj" as const,
      };

      saveToSession("settings", savedSettings);
      const settings = loadSettings();

      expect(settings).toEqual(savedSettings);
    });

    it("should handle missing individual settings gracefully", () => {
      const partialSettings = {
        renderQuality: "low" as const,
        showGrid: false,
      };

      saveToSession("settings", partialSettings);
      const settings = loadSettings();

      expect(settings.renderQuality).toBe("low");
      expect(settings.showGrid).toBe(false);
      expect(settings.backgroundColor).toBe(DEFAULT_SETTINGS.backgroundColor);
      expect(settings.autoOptimize).toBe(DEFAULT_SETTINGS.autoOptimize);
      expect(settings.defaultExport).toBe(DEFAULT_SETTINGS.defaultExport);
    });

    it("should return DEFAULT_SETTINGS if malformed data is stored", () => {
      sessionStorage.setItem(
        "ct-app-settings",
        "not valid json {"
      );

      const settings = loadSettings();

      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("saveSettings", () => {
    it("should save complete settings object", () => {
      const settings = {
        renderQuality: "medium" as const,
        backgroundColor: "dark-gray" as const,
        showGrid: false,
        autoOptimize: false,
        defaultExport: "obj" as const,
      };

      saveSettings(settings);
      const retrieved = getFromSession<typeof settings>("settings");

      expect(retrieved).toEqual(settings);
    });

    it("should save partial settings object", () => {
      const partialSettings = {
        renderQuality: "low" as const,
        showGrid: false,
      };

      saveSettings(partialSettings as any);
      const retrieved = getFromSession<any>("settings");

      expect(retrieved?.renderQuality).toBe("low");
      expect(retrieved?.showGrid).toBe(false);
    });

    it("should overwrite previous settings", () => {
      const firstSettings = {
        renderQuality: "high" as const,
        backgroundColor: "light-gray" as const,
        showGrid: true,
        autoOptimize: true,
        defaultExport: "stl" as const,
      };

      const secondSettings = {
        renderQuality: "low" as const,
        backgroundColor: "dark-gray" as const,
        showGrid: false,
        autoOptimize: false,
        defaultExport: "obj" as const,
      };

      saveSettings(firstSettings);
      saveSettings(secondSettings);

      const retrieved = getFromSession<typeof secondSettings>("settings");
      expect(retrieved).toEqual(secondSettings);
    });
  });

  describe("Save/Load Roundtrips", () => {
    it("should preserve data integrity through save and load cycle", () => {
      const testObject = {
        id: "123",
        values: [1, 2, 3, 4, 5],
        nested: { key: "value", bool: false },
      };

      saveToSession("roundtrip", testObject);
      const retrieved = getFromSession<typeof testObject>("roundtrip");

      expect(retrieved).toEqual(testObject);
    });

    it("should handle multiple sequential saves and loads", () => {
      const values = ["first", "second", "third"];

      for (const value of values) {
        saveToSession("sequential", value);
      }

      const retrieved = getFromSession<string>("sequential");
      expect(retrieved).toBe("third");
    });

    it("should maintain data when saving and loading settings multiple times", () => {
      const settings1 = { renderQuality: "high" as const };
      const settings2 = { showGrid: false };

      saveSettings(settings1 as any);
      let loaded = loadSettings();
      expect(loaded.renderQuality).toBe("high");

      saveSettings(settings2 as any);
      loaded = loadSettings();
      expect(loaded.renderQuality).toBe("high");
      expect(loaded.showGrid).toBe(false);
    });
  });
});
