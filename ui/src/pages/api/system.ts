import useSWR, { MutatorOptions } from 'swr';
import { BinaryStream, fetcher } from '../../libs';

const API_URL = '/api/config/system';

export type System = {
  fanMaxPwmValue: number;
  fanMaxTemperature: number;
  fanMinPwmValue: number;
  fanMinTemperature: number;
  lightSensorMaxAmbientBrightness: number;
  lightSensorMaxLedBrightness: number;
  lightSensorMaxValue: number;
  lightSensorMinAmbientBrightness: number;
  lightSensorMinLedBrightness: number;
  lightSensorMinValue: number;
  lightSensorMode: number;
  lightSensorThreshold: number;
  logLevel: number;
  regulatorCutoffTemperature: number;
  regulatorHighTemperature: number;
  systemPowerLimit: number;
};

export const useSystem = () => {
  const { data, mutate, error } = useSWR<string, Error>(API_URL, (url) =>
    fetcher(url, {
      headers: {
        Accept: 'application/octet-stream',
      },
    }),
  );

  return {
    data: decode(data),
    isError: error,
    isLoading: !error && !data,
    mutate: (data: System, opts?: MutatorOptions) =>
      mutate(fetcher(API_URL, { method: 'POST', body: encode(data) }), opts),
  };
};

const decode = (data?: string): System | undefined => {
  if (!data) return undefined;

  const stream = new BinaryStream();
  stream.loadFromBase64(data);

  return {
    logLevel: stream.readByte() ?? 1,
    lightSensorMode: stream.readByte() ?? 1,
    lightSensorThreshold: stream.readWord() ?? 30,
    lightSensorMinValue: stream.readWord() ?? 30,
    lightSensorMaxValue: stream.readWord() ?? 2048,
    lightSensorMinAmbientBrightness: stream.readByte() ?? 5,
    lightSensorMaxAmbientBrightness: stream.readByte() ?? 255,
    lightSensorMinLedBrightness: stream.readByte() ?? 5,
    lightSensorMaxLedBrightness: stream.readByte() ?? 255,
    systemPowerLimit: stream.readByte() ?? 10,
    regulatorHighTemperature: stream.readByte() ?? 80,
    regulatorCutoffTemperature: stream.readByte() ?? 90,
    fanMinPwmValue: stream.readByte() ?? 100,
    fanMaxPwmValue: stream.readByte() ?? 255,
    fanMinTemperature: stream.readByte() ?? 60,
    fanMaxTemperature: stream.readByte() ?? 80,
  };
};

const encode = (data: System): string => {
  const stream = new BinaryStream(14);

  stream.writeByte(data.logLevel);
  stream.writeByte(data.lightSensorMode);
  stream.writeWord(data.lightSensorThreshold);
  stream.writeWord(data.lightSensorMinValue);
  stream.writeWord(data.lightSensorMaxValue);
  stream.writeByte(data.lightSensorThreshold);
  stream.writeByte(data.lightSensorMinAmbientBrightness);
  stream.writeByte(data.lightSensorMaxAmbientBrightness);
  stream.writeByte(data.lightSensorMinLedBrightness);
  stream.writeByte(data.lightSensorMaxLedBrightness);
  stream.writeByte(data.systemPowerLimit);
  stream.writeByte(data.regulatorHighTemperature);
  stream.writeByte(data.regulatorCutoffTemperature);
  stream.writeByte(data.fanMinPwmValue);
  stream.writeByte(data.fanMaxPwmValue);
  stream.writeByte(data.fanMinTemperature);
  stream.writeByte(data.fanMaxTemperature);

  return stream.saveToBase64();
};
