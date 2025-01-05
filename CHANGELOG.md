# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
