import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Header,
  InputPassword,
  InputText,
  MenuItem,
  Select,
  SelectItem,
  Slider,
  Toast,
} from '../components';
import { useSystem, useWifi } from './api';

type FormData = {
  system: {
    logLevel: string;
    lightSensorMode: string;
    lightSensorThreshold: number;
    lightSensorMinValue: number;
    lightSensorMaxValue: number;
    lightSensorMinAmbientBrightness: number;
    lightSensorMaxAmbientBrightness: number;
    lightSensorMinLedBrightness: number;
    lightSensorMaxLedBrightness: number;
    systemPowerLimit: number;
    regulatorHighTemperature: number;
    regulatorCutoffTemperature: number;
    fanMinPwmValue: number;
    fanMaxPwmValue: number;
    fanMinTemperature: number;
    fanMaxTemperature: number;
  };
  wifi: {
    accessPointSsid: string;
    accessPointPassword: string;
  };
};

const DEFAULT_VALUES: FormData = {
  system: {
    fanMaxPwmValue: 255,
    fanMaxTemperature: 80,
    fanMinPwmValue: 100,
    fanMinTemperature: 60,
    lightSensorMaxAmbientBrightness: 255,
    lightSensorMaxLedBrightness: 255,
    lightSensorMaxValue: 2048,
    lightSensorMinAmbientBrightness: 5,
    lightSensorMinLedBrightness: 5,
    lightSensorMinValue: 30,
    lightSensorMode: '1',
    lightSensorThreshold: 30,
    logLevel: '1',
    regulatorCutoffTemperature: 90,
    regulatorHighTemperature: 80,
    systemPowerLimit: 10,
  },
  wifi: {
    accessPointPassword: 'TesLightPW',
    accessPointSsid: 'TesLight',
  },
};

export const Settings = (): JSX.Element => {
  const [isToastOpen, setToastOpen] = useState<boolean>(false);

  const { data: system, mutate: mutateSystem } = useSystem();
  const { data: wifi, mutate: mutateWifi } = useWifi();

  const { handleSubmit, watch, control, reset } = useForm<FormData>({
    defaultValues: {
      system: {
        fanMaxPwmValue: system?.fanMaxPwmValue,
        fanMaxTemperature: system?.fanMaxTemperature,
        fanMinPwmValue: system?.fanMinPwmValue,
        fanMinTemperature: system?.fanMinTemperature,
        lightSensorMaxAmbientBrightness:
          system?.lightSensorMaxAmbientBrightness,
        lightSensorMaxLedBrightness: system?.lightSensorMaxLedBrightness,
        lightSensorMaxValue: system?.lightSensorMaxValue,
        lightSensorMinAmbientBrightness:
          system?.lightSensorMinAmbientBrightness,
        lightSensorMinLedBrightness: system?.lightSensorMinLedBrightness,
        lightSensorMinValue: system?.lightSensorMinValue,
        lightSensorMode: system?.lightSensorMode.toString(),
        lightSensorThreshold: system?.lightSensorThreshold,
        logLevel: system?.logLevel.toString(),
        regulatorCutoffTemperature: system?.regulatorCutoffTemperature,
        regulatorHighTemperature: system?.regulatorHighTemperature,
        systemPowerLimit: system?.systemPowerLimit,
      },
      wifi: {
        accessPointPassword: wifi?.accessPointPassword,
        accessPointSsid: wifi?.accessPointSsid,
      },
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data) => {
    const wifiCopy = JSON.parse(JSON.stringify(wifi)) as NonNullable<
      typeof wifi
    >;
    await mutateWifi({ ...wifiCopy, ...data.wifi });

    const systemCopy = JSON.parse(JSON.stringify(system)) as NonNullable<
      typeof system
    >;
    const { lightSensorMode, logLevel, ...rest } = data.system;
    await mutateSystem({
      ...systemCopy,
      ...rest,
      lightSensorMode: Number(lightSensorMode),
      logLevel: Number(logLevel),
    });

    setToastOpen(true);
  });

  const onReset = async () => {
    reset(DEFAULT_VALUES);
    await onSubmit();
  };

  return (
    <>
      <Header name={MenuItem.Settings} />
      <form onSubmit={onSubmit}>
        <h2 className="mb-6 text-lg font-medium">Light Sensor</h2>
        <label className="mb-6 flex flex-row justify-between">
          <span className="basis-1/2 self-center">Mode</span>
          <div className="basis-1/2 text-right">
            <Select<FormData> control={control} name="system.lightSensorMode">
              <SelectItem value="0">Always Off</SelectItem>
              <SelectItem value="1">Always On</SelectItem>
              <SelectItem value="2">Automatic On/Off ADC</SelectItem>
              <SelectItem value="3">Automatic Brightness ADC</SelectItem>
              <SelectItem value="4">Automatic On/Off BH1750</SelectItem>
              <SelectItem value="5">Automatic Brightness BH1750</SelectItem>
            </Select>
          </div>
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Threshold: {watch('system.lightSensorThreshold')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={255}
            step={1}
            control={control}
            name="system.lightSensorThreshold"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Minimum Brightness:{' '}
            {watch('system.lightSensorMinAmbientBrightness')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={255}
            step={1}
            control={control}
            name="system.lightSensorMinAmbientBrightness"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Maximum Brightness:{' '}
            {watch('system.lightSensorMaxAmbientBrightness')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={255}
            step={1}
            control={control}
            name="system.lightSensorMaxAmbientBrightness"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Minimum LED Brightness:{' '}
            {watch('system.lightSensorMinLedBrightness')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={255}
            step={1}
            control={control}
            name="system.lightSensorMinLedBrightness"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Maximum LED Brightness:{' '}
            {watch('system.lightSensorMaxLedBrightness')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={255}
            step={1}
            control={control}
            name="system.lightSensorMaxLedBrightness"
          />
        </label>

        <h2 className="mb-6 text-lg font-medium">Wifi Hotspot</h2>
        <label className="mb-6 flex flex-row">
          <span className="basis-1/2 self-center">SSID</span>
          <InputText<FormData>
            control={control}
            maxLength={32}
            minLength={2}
            name="wifi.accessPointSsid"
            pattern="^[0-9a-zA-Z-_ ]+$"
            placeholder="TesLight"
          />
        </label>
        <label className="mb-6 flex flex-row">
          <span className="basis-1/2 self-center">Password</span>
          <div className="basis-1/2">
            <InputPassword<FormData>
              control={control}
              maxLength={63}
              minLength={8}
              name="wifi.accessPointPassword"
              pattern='^[0-9a-zA-Z+-_!"§$%&\/()=?*# ]+$'
              placeholder="7e5L19H7"
            />
          </div>
        </label>

        <h2 className="mb-6 text-lg font-medium">Regulator</h2>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Power Limit (W): {watch('system.systemPowerLimit')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={1}
            max={100}
            step={1}
            control={control}
            name="system.systemPowerLimit"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Throttle Temperature (°C):{' '}
            {watch('system.regulatorHighTemperature')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={60}
            max={90}
            step={1}
            control={control}
            name="system.regulatorHighTemperature"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Shut Down Temperature (°C):{' '}
            {watch('system.regulatorCutoffTemperature')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={60}
            max={90}
            step={1}
            control={control}
            name="system.regulatorCutoffTemperature"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Fan Start Temp (°C): {watch('system.fanMinTemperature')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={40}
            max={70}
            step={1}
            control={control}
            name="system.fanMinTemperature"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Fan Full Speed Temp (°C): {watch('system.fanMaxTemperature')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={50}
            max={90}
            step={1}
            control={control}
            name="system.fanMaxTemperature"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Fan Min PWM (Stall Guard): {watch('system.fanMinPwmValue')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={0}
            max={255}
            step={1}
            control={control}
            name="system.fanMinPwmValue"
          />
        </label>
        <label className="mb-6 flex flex-col">
          <span className="mb-2">
            Fan Max PWM: {watch('system.fanMaxPwmValue')}
          </span>
          <Slider<FormData>
            className="w-full"
            min={0}
            max={255}
            step={1}
            control={control}
            name="system.fanMaxPwmValue"
          />
        </label>

        <h2 className="mb-6 text-lg font-medium">Logging and Debugging</h2>
        <label className="mb-6 flex flex-row justify-between">
          <span className="basis-1/2 self-center">Log Level</span>
          <div className="basis-1/2 text-right">
            <Select<FormData> control={control} name="system.logLevel">
              <SelectItem value="0">Debug</SelectItem>
              <SelectItem value="1">Info</SelectItem>
              <SelectItem value="2">Warning</SelectItem>
              <SelectItem value="3">Error</SelectItem>
            </Select>
          </div>
        </label>

        <Button type="submit" className="mb-4">
          Apply Settings
        </Button>

        <Button type="reset" onClick={onReset}>
          Reset to default
        </Button>
      </form>

      <Toast
        title="Saved successfully!"
        open={isToastOpen}
        onOpenChange={setToastOpen}
      />
    </>
  );
};
