/**
 * @file ConnectionTestEndpoint.h
 * @author TheRealKasumi
 * @brief Contains a REST endpoint to test the connection to the controller.
 *
 * @copyright Copyright (c) 2022
 *
 */
#include "server/ConnectionTestEndpoint.h"

/**
 * @brief Add all request handler for this {@link TesLight::RestEndpoint} to the {@link TesLight::WebServerManager}.
 */
void TesLight::ConnectionTestEndpoint::begin()
{
	webServerManager->addRequestHandler((getBaseUri() + F("connection_test")).c_str(), http_method::HTTP_GET, TesLight::ConnectionTestEndpoint::handleConnectionTest);
}

/**
 * @brief Handler function for the connection test.
 */
void TesLight::ConnectionTestEndpoint::handleConnectionTest()
{
	webServer->send(200, F("application/text"), (String)F("Hey there, I am running. Current runtime: ") + String(millis()));
}