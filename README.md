# My-JSON-Server (Library)

A lightweight TypeScript library to interact with **my-json-server** via HTTP and WebSocket.  
Easily read, write, delete, and listen for real-time changes in your JSON data.

Check out the server repository: [my-json-server](https://github.com/JGEsteves89/my-json-server)


---
## Issues
- The name of the library on the example is wrong
- Please update the types so it allows both arrays and dicts

---

## Features

- **Simple HTTP API**: read, write, and delete JSON data.
- **Real-time updates**: WebSocket support to listen for changes.
- **TypeScript friendly**: fully typed API for safer code.
- **Node.js support**: works seamlessly in modern Node environments.

---

## Installation

```bash
npm install my-json-server-lib
# or
yarn add my-json-server-lib
```

* * *

## Usage Example

```typescript
import MyJSON from 'my-json-server-lib';

(async () => {
  const API_TOKEN = 'THIS_IS_A_CLIENT_TOKEN';
  const myJSON = MyJSON.connect('http://localhost:3000/client/test', API_TOKEN);
  // listens for the next change
  myJSON.onChange((updatedData) => {
    console.log('Data changed in real-time:', updatedData);
  });

  // write a new data
  console.log('Creating the data...');
  await myJSON.write({ foo: 'foo' });
  console.log('Data created');

  // gets the data from server
  console.log('Reading data...');
  const data = await myJSON.read();
  console.log('Current data:', data);

  // rewrites the data again.
  data.foo = 'bar';
  await myJSON.write(data);
  console.log('Data updated successfully');
})();
```

* * *

## API

### `MyJSON.connect<T>(baseUrl, token)`

Creates a new client instance.

* **`baseUrl`**: API endpoint URL
* **`token`**: authentication token

### `read(): Promise<T>`

Fetches the current JSON data from the server.

### `write(data: T)`

Sends or updates JSON data on the server.

### `delete()`

Deletes the JSON data from the server.

### `onChange(callback: (data: T) => void)`

Listens for real-time updates via WebSocket.

### `close()`

Closes the WebSocket connection.

* * *

## Contributing

We (me and my dog) welcome contributions! 🛠️

Feel free to open issues, suggest improvements, or submit pull requests.
Whether it’s fixing bugs, adding features, or improving documentation, every contribution helps.

Please follow the coding style and best practices used in the library.

## Notes

* The library automatically allows Node.js to exit if no other work is pending (WebSocket uses `unref()` internally).
* Supports both TypeScript and JavaScript projects.

* * *

## License

MIT

## Changelog

This version:
- 1.0.1 - Updated import and export package.json definitions 
- 1.0.1 - MyJSON now accepts dicts and arrays
- 1.0.1 - Fix name of the libary, updated examples and readme
- 1.0.0 - Initial implementation
