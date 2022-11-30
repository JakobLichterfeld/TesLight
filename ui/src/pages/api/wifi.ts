import useSWR, { MutatorOptions } from 'swr';
import {
  BinaryStream,
  fetcher,
  isValidPassword,
  isValidSsid,
} from '../../libs';

const API_URL = '/api/config/wifi';

export type Wifi = {
  accessPointChannel: number;
  accessPointHidden: boolean;
  accessPointMaxConnections: number;
  accessPointPassword: string;
  accessPointSsid: string;
  wifiPassword: string;
  wifiSsid: string;
};

export const useWifi = () => {
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
    mutate: (data: Wifi, opts?: MutatorOptions) =>
      mutate(fetcher(API_URL, { method: 'POST', body: encode(data) }), opts),
  };
};

const decode = (data?: string): Wifi | undefined => {
  if (!data) return undefined;

  const stream = new BinaryStream();
  stream.loadFromBase64(data);

  const wifi: Wifi = {
    accessPointChannel: 1,
    accessPointHidden: stream.readByte() === 1,
    accessPointMaxConnections: stream.readByte() ?? 1,
    accessPointPassword: stream.readString(),
    accessPointSsid: stream.readString(),
    wifiPassword: stream.readString(),
    wifiSsid: stream.readString(),
  };

  return {
    ...wifi,
    accessPointPassword: isValidPassword(wifi.accessPointPassword)
      ? wifi.accessPointPassword
      : 'TesLightPW',
    accessPointSsid: isValidSsid(wifi.accessPointSsid)
      ? wifi.accessPointSsid
      : 'TesLight',
    wifiPassword: isValidPassword(wifi.wifiPassword) ? wifi.wifiPassword : '',
    wifiSsid: isValidSsid(wifi.wifiSsid) ? wifi.wifiSsid : '',
  };
};

const encode = (data: Wifi): string => {
  let length = 3;
  length += data.accessPointSsid.length + 2;
  length += data.accessPointPassword.length + 2;
  length += data.wifiSsid.length + 2;
  length += data.wifiPassword.length + 2;

  const stream = new BinaryStream(length);
  stream.writeString(data.accessPointSsid);
  stream.writeString(data.accessPointPassword);
  stream.writeByte(data.accessPointChannel);
  stream.writeByte(+data.accessPointHidden);
  stream.writeByte(data.accessPointMaxConnections);
  stream.writeString(data.wifiSsid);
  stream.writeString(data.wifiPassword);

  return stream.saveToBase64();
};
