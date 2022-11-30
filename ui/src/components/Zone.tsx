import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import hexRgb from 'hex-rgb';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import rgbHex from 'rgb-hex';
import { keyToWord, toPercentage } from '../libs';
import { useLed } from '../pages/api';
import { Button } from './Button';
import { ColorPicker } from './ColorPicker';
import type { MenuItem } from './Menu';
import { Select, SelectItem } from './Select';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { Toast } from './Toast';

export enum Animation {
  Rainbow,
  RainbowLinear,
  RainbowCentered,
  GradientLinear,
  GradientCenter,
  Static,
  ColorBarsLinearHard,
  ColorBarsLinearSoft,
  ColorBarsCenterHard,
  ColorBarsCenterSoft,
  RainbowLinearAccX,
  RainbowLinearAccY,
  RainbowCenteredAccX,
  RainbowCenteredAccY,
  GradientLinearAccX,
  GradientLinearAccY,
  GradientCenteredAccX,
  GradientCenteredAccY,
}

type FormData = {
  brightness: number;
  color1: string;
  color2: string;
  fadeSpeed: number;
  isReverse: boolean;
  ledChannelCurrent: number;
  ledCount: number;
  ledVoltage: number;
  offset: number;
  speed: number;
  type: string;
};

const DEFAULT_VALUES: FormData = {
  brightness: 50,
  color1: '#000000',
  color2: '#000000',
  fadeSpeed: 5,
  isReverse: false,
  ledChannelCurrent: 14,
  ledCount: 1,
  ledVoltage: 50,
  offset: 10,
  speed: 50,
  type: '0',
};

type ZoneProps = { name: MenuItem };

export const Zone = ({ name }: ZoneProps): JSX.Element => {
  const [isToastOpen, setToastOpen] = useState<boolean>(false);

  const { data, mutate } = useLed();
  const zone = data?.[name];

  const { handleSubmit, watch, control, reset } = useForm<FormData>({
    defaultValues: {
      brightness: zone?.brightness,
      color1: `#${rgbHex(
        zone?.customFields[0] ?? 0,
        zone?.customFields[1] ?? 0,
        zone?.customFields[2] ?? 0,
      )}`,
      color2: `#${rgbHex(
        zone?.customFields[3] ?? 0,
        zone?.customFields[4] ?? 0,
        zone?.customFields[5] ?? 0,
      )}`,
      fadeSpeed: zone?.fadeSpeed,
      isReverse: zone?.isReverse,
      ledChannelCurrent: zone?.ledChannelCurrent[0],
      ledCount: zone?.ledCount,
      ledVoltage: zone?.ledVoltage,
      offset: zone?.offset,
      speed: zone?.speed,
      type: zone?.type.toString(),
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(
    async ({ color1, color2, ledChannelCurrent, type, ...rest }) => {
      const led = JSON.parse(JSON.stringify(data)) as NonNullable<typeof data>;

      const rgbColor1 = hexRgb(color1);
      led[name].customFields[0] = rgbColor1.red;
      led[name].customFields[1] = rgbColor1.green;
      led[name].customFields[2] = rgbColor1.blue;

      const rgbColor2 = hexRgb(color2);
      led[name].customFields[3] = rgbColor2.red;
      led[name].customFields[4] = rgbColor2.green;
      led[name].customFields[5] = rgbColor2.blue;

      led[name] = {
        ...led[name],
        ...rest,
        ledChannelCurrent: [...Array(3)].fill(ledChannelCurrent),
        type: Number(type),
      };

      await mutate(led);

      setToastOpen(true);
    },
  );

  const onReset = async () => {
    reset(DEFAULT_VALUES);
    await onSubmit();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="mb-6 text-lg font-medium">Basic</h2>

      <label className="mb-6 flex flex-row justify-between">
        <span className="basis-1/2 self-center">Animation</span>
        <div className="basis-1/2 text-right">
          <Select<FormData> control={control} name="type">
            {Object.keys(Animation)
              .filter((key) => isNaN(Number(key)))
              .map((key, index) => (
                <SelectItem key={key} value={index.toString()}>
                  {keyToWord(key)}
                </SelectItem>
              ))}
          </Select>
        </div>
      </label>

      <label className="mb-6 flex flex-col">
        <span className="mb-2">
          Brightness: {toPercentage(watch('brightness'))}%
        </span>
        <Slider<FormData>
          className="w-full"
          control={control}
          name="brightness"
          min={0}
          max={255}
          step={1}
        />
      </label>

      {![
        Animation.GradientCenter,
        Animation.GradientLinear,
        Animation.Static,
      ].includes(Number(watch('type'))) && (
        <label className="mb-6 flex flex-col">
          <span className="mb-2">Speed: {toPercentage(watch('speed'))}%</span>
          <Slider<FormData>
            className="w-full"
            control={control}
            name="speed"
            min={0}
            max={255}
            step={5}
          />
        </label>
      )}

      {Animation.Static !== Number(watch('type')) && (
        <label className="mb-6 flex flex-col">
          <span className="mb-2">Offset: {toPercentage(watch('offset'))}%</span>
          <Slider<FormData>
            className="w-full"
            control={control}
            name="offset"
            min={0}
            max={255}
            step={5}
          />
        </label>
      )}

      {[
        Animation.ColorBarsCenterHard,
        Animation.ColorBarsCenterSoft,
        Animation.ColorBarsLinearHard,
        Animation.ColorBarsLinearSoft,
        Animation.GradientCenter,
        Animation.GradientCenteredAccX,
        Animation.GradientCenteredAccY,
        Animation.GradientLinear,
        Animation.GradientLinearAccX,
        Animation.GradientLinearAccY,
        Animation.Static,
      ].includes(Number(watch('type'))) && (
        <label className="mb-6 flex flex-col">
          <span className="mb-2">Color 1</span>
          <ColorPicker<FormData>
            className="h-10 w-full"
            control={control}
            name="color1"
          />
        </label>
      )}

      {[
        Animation.ColorBarsCenterHard,
        Animation.ColorBarsCenterSoft,
        Animation.ColorBarsLinearHard,
        Animation.ColorBarsLinearSoft,
        Animation.GradientCenter,
        Animation.GradientCenteredAccX,
        Animation.GradientCenteredAccY,
        Animation.GradientLinear,
        Animation.GradientLinearAccX,
        Animation.GradientLinearAccY,
      ].includes(Number(watch('type'))) && (
        <label className="mb-6 flex flex-col">
          <span className="mb-2">Color 2</span>
          <ColorPicker<FormData>
            className="h-10 w-full"
            control={control}
            name="color2"
          />
        </label>
      )}

      <label className="mb-6 flex flex-col">
        <span className="mb-2">
          Fading: {toPercentage(watch('fadeSpeed'))}%
        </span>
        <Slider<FormData>
          className="w-full"
          control={control}
          name="fadeSpeed"
          min={0}
          max={255}
          step={5}
        />
      </label>

      <h2 className="mb-6 text-lg font-medium">Advanced</h2>

      <label className="mb-6 flex flex-col">
        <span className="mb-2">LED Count: {watch('ledCount')}</span>
        <Slider<FormData>
          className="w-full"
          control={control}
          name="ledCount"
          min={2}
          max={200}
          step={1}
        />
      </label>

      <label className="mb-6 flex flex-col">
        <span className="mb-2">
          LED Voltage: {(watch('ledVoltage') / 10).toFixed(2)}
        </span>
        <Slider<FormData>
          className="w-full"
          min={40}
          max={55}
          step={1}
          control={control}
          name="ledVoltage"
        />
      </label>
      <label className="mb-6 flex flex-col">
        <span className="mb-2">
          LED Current per Channel (MA): {watch('ledChannelCurrent')}
        </span>
        <Slider<FormData>
          className="w-full"
          min={1}
          max={200}
          step={1}
          control={control}
          name="ledChannelCurrent"
        />
      </label>

      {Animation.Static !== Number(watch('type')) && (
        <label className="mb-6 flex flex-row">
          <div className="mr-4 self-center">
            <ArrowsRightLeftIcon className="h-4 w-4 text-zinc" />
          </div>
          <div className="flex flex-col">
            <span>Direction</span>
            <span className="text-sm text-zinc">
              Reverse the animation direction
            </span>
          </div>
          <div className="flex-grow self-center text-right">
            <Switch<FormData> control={control} name="isReverse" />
          </div>
        </label>
      )}

      <Button type="submit" className="mb-4">
        Apply Settings
      </Button>

      <Button type="reset" onClick={onReset}>
        Reset to default
      </Button>

      <Toast
        title="Saved successfully!"
        open={isToastOpen}
        onOpenChange={setToastOpen}
      />
    </form>
  );
};
