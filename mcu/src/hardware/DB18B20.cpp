/**
 * @file DS18B20.cpp
 * @author TheRealKasumi
 * @brief Implementation of the {@link TesLight::DS18B20}.
 *
 * @copyright Copyright (c) 2022
 *
 */
#include "hardware/DS18B20.h"

/**
 * @brief Create a new instance of {@link TesLight::DS18B20}.
 * @param busPin physical pin for the data bus
 */
TesLight::DS18B20::DS18B20(const uint8_t busPin)
{
	this->oneWire = new OneWire(busPin);
	this->numSensors = 0;
	this->sensorAddress = nullptr;
	this->resolution = nullptr;
	this->lastMeasurement = nullptr;
	this->measurementReadyTime = nullptr;
}

/**
 * @brief Delete the {@link TesLight::DS18B20} instance and free resources.
 */
TesLight::DS18B20::~DS18B20()
{
	if (this->oneWire)
	{
		delete this->oneWire;
		this->oneWire = nullptr;
	}
	if (this->sensorAddress)
	{
		delete[] this->sensorAddress;
		this->sensorAddress = nullptr;
	}
	if (this->resolution)
	{
		delete[] this->resolution;
		this->resolution = nullptr;
	}
	if (this->lastMeasurement)
	{
		delete[] this->lastMeasurement;
		this->lastMeasurement = nullptr;
	}
	if (this->measurementReadyTime)
	{
		delete[] this->measurementReadyTime;
		this->measurementReadyTime = nullptr;
	}
}

/**
 * @brief Initialize the {@link TesLight::DS18B20}.
 * @return true when successful
 * @return false when there was an error or no sensor was found
 */
bool TesLight::DS18B20::begin()
{
	uint64_t addressBuffer[4] = {0};
	if (!this->getSensors(this->numSensors, addressBuffer, 4))
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Failed to search sensors. The OneWire bus could be faulty."));
		return false;
	}

	if (this->numSensors == 0)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::DEBUG, SOURCE_LOCATION, F("Search completed but no sensors found."));
		return true;
	}

	this->sensorAddress = new uint64_t[this->numSensors];
	this->resolution = new TesLight::DS18B20::DS18B20Res[this->numSensors];
	this->lastMeasurement = new float[this->numSensors];
	this->measurementReadyTime = new unsigned long[this->numSensors];
	for (uint8_t i = 0; i < this->numSensors; i++)
	{
		this->sensorAddress[i] = addressBuffer[i];
		this->resolution[i] = TesLight::DS18B20::DS18B20Res::DS18B20_12_BIT;
		this->lastMeasurement[i] = 0.0f;
		this->measurementReadyTime[i] = ULONG_MAX;
	}

	return true;
}

/**
 * @brief Get the number of available sensors.
 * @return number of sensors
 */
uint8_t TesLight::DS18B20::getNumSensors()
{
	return this->numSensors;
}

/**
 * @brief Get a sensor address by it's index.
 * @param sensorIndex index of the sensor
 * @return address of the sensor
 */
uint64_t TesLight::DS18B20::getSensorAddress(const uint8_t sensorIndex)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		return 0;
	}

	return this->sensorAddress[sensorIndex];
}

/**
 * @brief Set the resolution of a specific sensor by it's index.
 * @param sensorIndex index of the sensor
 * @param resolution resolution to set
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::DS18B20::setResolution(const uint8_t sensorIndex, const TesLight::DS18B20::DS18B20Res resolution)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		return false;
	}

	if (!this->oneWire->reset())
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Failed to reset OneWire bus. The bus lines might be shorted or a sensor is malfunctioning."));
		return false;
	}

	this->oneWire->select((uint8_t *)&this->sensorAddress[sensorIndex]);
	this->oneWire->write(0x4E, 0);
	this->oneWire->write(0x00, 0);
	this->oneWire->write(0x00, 0);
	this->oneWire->write(resolution);

	this->resolution[sensorIndex] = resolution;
	return true;
}

/**
 * @brief Get the resolution of a specific sensor by it's index.
 * @param sensorIndex index of the sensor
 * @param resolution variable to hold the resolution
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::DS18B20::getResolution(const uint8_t sensorIndex, TesLight::DS18B20::DS18B20Res &resolution)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		return false;
	}
	return this->resolution[sensorIndex];
}

/**
 * @brief Start a temperature measurement for a sensor with a given resolution.
 * @param sensorIndex index of the sensor
 * @param resolution resolution for the measurement
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::DS18B20::startMeasurement(const uint8_t sensorIndex)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		return false;
	}

	if (!this->oneWire->reset())
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Failed to reset OneWire bus. The bus lines might be shorted or a sensor is malfunctioning."));
		return false;
	}

	this->oneWire->select((uint8_t *)&this->sensorAddress[sensorIndex]);
	this->oneWire->write(0x44, 0);

	if (this->resolution[sensorIndex] == TesLight::DS18B20::DS18B20Res::DS18B20_9_BIT)
	{
		this->measurementReadyTime[sensorIndex] = millis() + 110;
	}
	else if (this->resolution[sensorIndex] == TesLight::DS18B20::DS18B20Res::DS18B20_10_BIT)
	{
		this->measurementReadyTime[sensorIndex] = millis() + 200;
	}
	else if (this->resolution[sensorIndex] == TesLight::DS18B20::DS18B20Res::DS18B20_11_BIT)
	{
		this->measurementReadyTime[sensorIndex] = millis() + 400;
	}
	else if (this->resolution[sensorIndex] == TesLight::DS18B20::DS18B20Res::DS18B20_12_BIT)
	{
		this->measurementReadyTime[sensorIndex] = millis() + 800;
	}
	return true;
}

/**
 * @brief Check if the measurement for a specific sensor is ready.
 * @param sensorIndex index of the sensor
 * @return true when the sensor is ready to be read
 * @return false when it is not ready
 */
bool TesLight::DS18B20::isMeasurementReady(const uint8_t sensorIndex)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		return false;
	}
	return millis() >= this->measurementReadyTime[sensorIndex];
}

/**
 * @brief Read the temperature value from a specific sensor.
 * @param sensorIndex index of the sensor to read
 * @param temp variable to hold the temperature
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::DS18B20::getTemperature(const uint8_t sensorIndex, float &temp)
{
	if (sensorIndex >= this->numSensors)
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Sensor index out of bounds."));
		temp = 0.0f;
		return false;
	}

	if (!this->isMeasurementReady(sensorIndex))
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::DEBUG, SOURCE_LOCATION, F("Sensor is not ready. Return previous measurement."));
		temp = this->lastMeasurement[sensorIndex];
		return true;
	}

	if (!this->oneWire->reset())
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("Failed to reset OneWire bus. The bus lines might be shorted or a sensor is malfunctioning."));
		return false;
	}

	this->oneWire->select((uint8_t *)&this->sensorAddress[sensorIndex]);
	this->oneWire->write(0xBE);

	uint8_t data[9] = {0};
	for (uint8_t i = 0; i < 9; i++)
	{
		data[i] = this->oneWire->read();
	}

	if (OneWire::crc8(data, 8) != data[8])
	{
		TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("The CRC of the sensors address is invalid. Check the OneWire bus."));
		temp = 0.0f;
		return false;
	}

	int16_t raw = (data[1] << 8) | data[0];
	const uint8_t resolution = (data[4] & 0x60);
	if (resolution == 0x00) // 9 bit
	{
		raw = raw & ~7;
	}
	else if (resolution == 0x20) // 10 bit
	{
		raw = raw & ~3;
	}
	else if (resolution == 0x40) // 11 bit
	{
		raw = raw & ~1;
	}

	temp = (float)raw / 16.0f;
	this->lastMeasurement[sensorIndex] = temp;
	return true;
}

/**
 * @brief Count all DS18B20 sensors on the bus and get their addresses.
 * @param sensorCount variable to hold the number of found sensors
 * @param sensorAddresses buffer to store the adresses
 * @param bufferSize size of the address buffer
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::DS18B20::getSensors(uint8_t &sensorCount, uint64_t sensorAddresses[], const uint8_t bufferSize)
{
	sensorCount = 0;
	this->oneWire->reset_search();
	while (this->oneWire->search((uint8_t *)&sensorAddresses[sensorCount]))
	{
		if (sensorCount >= bufferSize)
		{
			TesLight::Logger::log(TesLight::Logger::LogLevel::WARN, SOURCE_LOCATION, F("The input buffer is too small. Can not find all sensors."));
			return true;
		}

		if (OneWire::crc8((uint8_t *)&sensorAddresses[sensorCount], 7) != ((uint8_t *)&sensorAddresses[sensorCount])[7])
		{
			TesLight::Logger::log(TesLight::Logger::LogLevel::ERROR, SOURCE_LOCATION, F("The CRC of the sensors address is invalid. Check the OneWire bus."));
			return false;
		}

		if (((uint8_t *)&sensorAddresses[sensorCount])[0] != 0x28)
		{
			continue;
		}

		sensorCount++;
	}
	return true;
}