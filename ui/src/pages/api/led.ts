import useSWR, { MutatorOptions } from 'swr';
import { BinaryStream, fetcher } from '../../libs';

const API_URL = '/api/config/led';

export type Led = {
  brightness: number;
  customFields: number[];
  fadeSpeed: number;
  isReverse: boolean;
  ledChannelCurrent: number[];
  ledCount: number;
  ledPin: number;
  ledVoltage: number;
  offset: number;
  speed: number;
  type: number;
};

export const useLed = () => {
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
    mutate: (data: Led[], opts?: MutatorOptions) =>
      mutate(fetcher(API_URL, { method: 'POST', body: encode(data) }), opts),
  };
};

const decode = (data?: string): Led[] | undefined => {
  if (!data) return undefined;

  const stream = new BinaryStream();
  stream.loadFromBase64(data);

  return [...Array(8)].map(() => ({
    ledPin: stream.readByte() ?? 13,
    ledCount: stream.readWord() ?? 1,
    type: stream.readByte() ?? 0,
    speed: stream.readByte() ?? 50,
    offset: stream.readWord() ?? 10,
    brightness: stream.readByte() ?? 50,
    isReverse: stream.readByte() >= 1,
    fadeSpeed: stream.readByte() ?? 5,
    customFields: [...Array(15)].map(() => stream.readByte() ?? 0),
    ledVoltage: stream.readByte() ?? 50,
    ledChannelCurrent: [...Array(3)].map(() => stream.readByte() ?? 14),
  }));
};

const encode = (data: Led[]): string => {
  const stream = new BinaryStream(232);

  data.forEach((zone) => {
    stream.writeByte(zone.ledPin);
    stream.writeWord(zone.ledCount);
    stream.writeByte(zone.type);
    stream.writeByte(zone.speed);
    stream.writeWord(zone.offset);
    stream.writeByte(zone.brightness);
    stream.writeByte(+zone.isReverse);
    stream.writeByte(zone.fadeSpeed);
    [...Array(15)].forEach((_, index) =>
      stream.writeByte(zone.customFields[index]),
    ),
      stream.writeByte(zone.ledVoltage);
    [...Array(3)].forEach((_, index) =>
      stream.writeByte(zone.ledChannelCurrent[index]),
    );
  });

  return stream.saveToBase64();
};
