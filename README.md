# node-intellicenter

A Typescript/CommonJS/ESModule library for interfacing with Pentair IntelliCenter pool controllers on your local network. To be able to discover local controllers, your network must support UDP broadcasts.

Tested with an IntelliCenter system on version IC: 1.064 , ICWEB:2021-10-19 1.007.

The [Wiki](https://github.com/parnic/node-intellicenter/wiki) has development notes on how the IntelliCenter API works under the hood.

## Usage

See [example.ts](./src/example.ts) for an example of interfacing with the library. Broadly, import the library with

```javascript
// ESM
import { FindUnits, Unit } from "node-intellicenter";
import * as messages from "node-intellicenter/messages";

// CJS
const { FindUnits, Unit } = require("node-intellicenter");
const messages = require("node-intellicenter/messages");
```

Then if you want to search for controllers on the network, create a new IntelliCenter unit finder with:

```javascript
const finder = new FindUnits();
```

And search for units:

```javascript
// async/await
const units = await finder.searchAsync();
const unitInfo = units[0];

// or event-based
finder.on("serverFound", (unitInfo) => {
  console.log(unitInfo);
});
finder.search();
```

This performs a UDP mDNS broadcast on 224.0.0.251, port 5353, so ensure your network supports UDP broadcasts and the device is on the same subnet.

If you have multiple network interfaces, you can be explicit about the one you want used for searching by passing its address to `FindUnits`, e.g.: `new FindUnits("10.0.0.3")`.

When a unit is found, connect to it by creating a new `Unit` with

```javascript
const unit = new Unit(unitInfo.addressStr, unitInfo.port);
```

or if you want to bypass the searching process because you know the address of your unit:

```javascript
const unit = new Unit("10.0.0.41", 6680); // substitute your unit's address here. port should generally be 6680 and will default to that if not provided.
```

Call `connect()` on the Unit instance:

```javascript
// async/await
await unit.connect();
console.log("connected!");

// promises
unit.connect().then(() => {
  console.log("connected!");
});

// or event-based
unit.once("connected", () => {
  console.log("connected!");
});
unit.connect();
```

Once you've connected, there are a number of methods available for interacting with the controller. See API reference below.

All communication with an IntelliCenter unit is done via TCP (WebSockets).

Send a request and handle the response with:

```javascript
const response = await unit.send(messages.GetSystemConfiguration());
console.log(JSON.stringify(response, null, 2));
```

## Examples

See [the example script](./src/example.ts) (transpiled [CJS version](./cjs/example.js) | [ESM version](./esm/example.js)) for some code examples to get you going.

## List-objects script

There is a [list-objects](./src/list-objects.ts) script available for easily identifying objects on your controller that you can use to get info from or set attributes on.

When invoked with `npm run list-objects` or `node esm/list-objects.js` it will search for units, then request and format+display the objects to the user. There are a few arguments available:

- `--controllerAddr=1.2.3.4`
  - Specifies the IntelliCenter controller's address directly which skips the searching phase. Substitute your controller's address for 1.2.3.4 here.
- `--controllerPort=1234`
  - Specifies the port to use when connecting to the controller (you generally should never need this; does nothing if `--controllerAddr` is not specified). Substitute your controller's port for 1234 here.
- `--multicastAddr=1.2.3.4`
  - Specifies the address of the network interface to send the multicast search packet on (useful if you have multiple adapters/interfaces and the system is picking the wrong one; does nothing if `--controllerAddr` is specified). Substitute your interface's address for 1.2.3.4 here.
- `--onlyToggleable`
  - Only displays objects which can be toggled on or off.

Note that if you are invoking this with `npm run list-objects` then the arguments must be specified after an empty `--` so that they are given to the script rather than npm itself. Example: `npm run list-objects -- --controllerAddr=10.0.0.41 --onlyToggleable`

## Contributing

Contributions are welcomed! Please open a pull request with your changes and let's discuss!

## API reference

See the list of [messages](./src/messages/messages.ts) for an up-to-date central listing of all available messages. These are essentially all helper methods for well-known messages, but you can construct your own by creating a new ICRequest via either the [GetRequest()](./src/messages/request.ts#L19) helper method or just constructing a `new ICRequest()` and filling it out (note: if you go the raw ICRequest route, you'll want some method of handling messageID that allows you to distinguish responses from each other).

IntelliCenter controllers can handle lots of messages being thrown at them at once and will respond when each request has been processed. This is why the `messageID` field on a request is important. If you use this library in async/await mode you'll only be dealing with one request in flight at a time, but that's not technically necessary.

### Overview

Messages (requests and responses) are sent in JSON format. Generally a request is made with a `command`, an optional `condition`, and an `objectList` with details about what properties ("keys") and objects are being referred to. Some commands, such as `GetQuery`, require additional properties to be specified.

See [ICRequest](./src/messages/request.ts) and [ICResponse](./src/messages/response.ts) as well as [ICParam](./src/messages/param.ts) for all known fields.

There are some redacted [connection logs](./connection-logs/) available for a raw look at some basic system communication. These were obtained by using [mitmproxy](https://mitmproxy.org/) as a websocket proxy and having the official Pentair Pool app connect to it while it was connected to the pool.

### Subscribing to updates

[SubscribeToUpdates](./src/messages/notify.ts) may be sent to be notified about changes to the given keys on the given object for the duration of the connection. It is unknown how/if you can unsubscribe after subscribing, but reconnecting to the unit will start fresh with no subscriptions registered.

Example:

```javascript
unit.on("notify", (msg) => {
  console.log("received notify:", msg);
});

await unit.send(messages.SubscribeToUpdates("B1202", ["LOTMP", "STATUS"]));
```

After calling the above function, any time the LOTMP or STATUS values change on body B1202, the `notify` event will trigger with the new value(s).

Note: even if you subscribe to multiple keys on an object, any given `notify` will only contain the actual key that changed. So always check if `obj.params.LOTMP`, for example, is set before using it in a `notify` callback.

[Here](https://github.com/parnic/MMM-IntelliCenter/blob/d305b3414cd58688f19b475bc299def41486d651/node_helper.js#L163-L308) is an implementation of `SubscribeToUpdates` / `.on("notify")` that you can use as an example.

### Events

#### FindUnits

- `"close"` - fired when the search socket has closed
- `"error"` - fired when an unrecoverable error has occurred in the search socket
- `"serverFound"` - fired immediately when an IntelliCenter unit has been located; receives a `UnitInfo` argument

#### Unit

Units will attempt to maintain a connection to the controller by pinging it every minute, but if the controller does not respond the connection will be terminated. Library consumers should handle the close event at a minimum and attempt to reconnect if the close was not intentional.

- `"response-{messageID}"` - fired once per message sent with `send()` where `{messageID}` is the ID specified in the `ICRequest` given to `send()`
- `"notify"` - fired when an update is available to a property previously subscribed to via a `SubscribeToUpdates` request
- `"close"` - fired any time the client is closed by any means (timeout, by request, error, etc.)
- `"open"` - fired when the socket connects to the unit successfully
- `"error"` - fired when the socket encounters an unrecoverable error and will close
- `"timeout"` - fired when the socket has not received a ping response within the allowed threshold and will close
- `"connected"` - fired when a connection has completed successfully
