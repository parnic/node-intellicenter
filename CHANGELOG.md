# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.5.2] = 2025-07-27

### Fixed

- Build fixed.

## [v0.5.1] - 2025-07-27

### Fixed

- Fixed being able to use the finder after closing it.

## [v0.5.0] - 2025-03-21

### Changed

- [Breaking change] SetHeatMode message now accepts a HeaterType value rather than an enabled boolean to support other heater types than just MasterTemp.

## [v0.4.0] - 2025-01-25

### Changed

- Reinstated the websocket library being used. In some cases, such as MagicMirror modules, the WebSocket class is not available.

## [v0.3.0] - 2025-01-15

### Changed

- Dropped the websocket library being used in favor of the default one for node. This allows tests to set up a mock server that the unit can connect to. Theoretically there's no consumer-visible behavior difference here, but it is a major change under the hood.

## [v0.2.2] - 2025-01-08

### Changed

- Unit errors now pass the error along.

## [v0.2.1] - 2025-01-08

### Fixed

- Fixed unit timeouts and socket errors not emitting the "close" event like the documentation says they do.

## [v0.2.0] - 2025-01-05

### Added

- Added list-objects script to discover object names. This is useful if you need to know what objects are available to your pool controller for the purposes of making direct calls referencing them. See readme for details on how to use it.

### Changed

- Split the pre-built files into CommonJS and ESModule variants. The package.json is setup to choose the right one based on whether you use require() or import. This avoids the previous requirement of using dynamic imports in a CJS consumer.
- [Breaking change] Messages no longer encapsulates its exports under the "messages" name, so users are free to import with their preferred name.

## [v0.1.0] - 2025-01-05

### Added

- Added GetCircuitStatus message for getting current status of all connected circuits.

### Changed

- [Breaking change] Renamed Item to Object in, e.g., messages.SetObjectStatus()

## [v0.0.2] - 2025-01-04

### Added

- Added "close", "open", "error", "timeout" events to Unit.
- Added more documentation and error checking to Unit methods.
- Added ability to specify which interface to broadcast the unit search on. Specify your adapter's address to pick which one to use, e.g. "10.0.0.3", "172.16.0.25". Leaving this argument out will use the previous behavior, which allows the system to choose the adapter it wants to use.
- Added FindUnits and Unit as exports from the base package to make importing and using the library easier in non-module consumers.
- Added "connected" event to Unit which runs once a connection is established and requests may be sent.

### Fixed

- Fixed the default import being the example code which was finding and running commands against controllers.

## [v0.0.1] - 2025-01-04

### Added

- Initial release. Includes basic ability to find and connect to an IntelliCenter unit and query and make changes to it.
