import { saveAs } from 'file-saver';
import { Button, Header, Log, MenuItem } from '../components';
import { toMbyte } from '../libs';
import { useLog, useLogSize } from './api';

const LOG_FILES = MenuItem.LogFiles;

export const LogFiles = (): JSX.Element => {
  const maxLogSize = 10000;

  const { data: logSize } = useLogSize();

  let startByte = 0;
  let byteCount = 0;
  if (logSize && logSize > maxLogSize) {
    startByte = logSize - maxLogSize;
    byteCount = maxLogSize;
  } else {
    startByte = 0;
    byteCount = logSize ?? 0;
  }

  const { data, mutate } = useLog({ startByte, byteCount });

  const onDownload = () => {
    const blob = new Blob([data!], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `TesLight_${Date.now()}.log`);
  };

  const onClear = async () => await mutate();

  return (
    <>
      <Header name={LOG_FILES} />

      <Log className="max-h-[65vh] overflow-scroll">{data}</Log>
      <p className="mb-6 text-right text-zinc">{toMbyte(logSize ?? 0)} MB</p>

      <Button type="button" className="mb-4" onClick={onDownload}>
        Download
      </Button>

      <Button type="reset" onClick={onClear}>
        Clear
      </Button>
    </>
  );
};
