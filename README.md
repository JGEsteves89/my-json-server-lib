# My-JSON-Server (Library)

A lightweight TypeScript library to interact with **my-json-server** via HTTP and WebSocket.  
Easily read, write, delete, and listen for real-time changes in your JSON data.

Check out the server repository: [my-json-server](https://github.com/JGEsteves89/my-json-server)

---

## Features

- **Simple HTTP API**: read, write, and delete JSON data.
- **Real-time updates**: WebSocket support to listen for changes.
- **TypeScript friendly**: fully typed API for safer code.
- **Node.js support**: works seamlessly in modern Node environments.

---

## Installation

```bash
npm install my-json-server
# or
yarn add my-json-server
```

* * *

## Usage Example

```typescript
import MyJSON from 'my-json-server';

(async () => {
  const API_TOKEN = 'THIS_IS_A_CLIENT_TOKEN';
  const myJSON = MyJSON.connect('http://localhost:3000/client/test', API_TOKEN);

  // Listen for real-time changes
  myJSON.onChange((updatedData) => {
    console.log('Data changed in real-time:', updatedData);
  });

  // Create new data
  console.log('Creating the data...');
  await myJSON.write({ foo: 'foo' });
  console.log('Data created');

  // Read data from server
  console.log('Reading data...');
  const data = await myJSON.read();
  console.log('Current data:', data);

  // Update the data
  data.foo = 'bar';
  await myJSON.write(data);
  console.log('Data updated successfully');

  // Close the WebSocket when done
  myJSON.close();
})();
```

* * *

## API

### `MyJSON.connect(baseUrl, token)`

Creates a new client instance.

* **`baseUrl`**: API endpoint URL
    
* **`token`**: authentication token
    

### `read(): Promise<T>`

Fetches the current JSON data from the server.

### `write(data: T): Promise<void>`

Sends or updates JSON data on the server.

### `delete(): Promise<void>`

Deletes the JSON data from the server.

### `onChange(callback: (data: T) => void): void`

Listens for real-time updates via WebSocket.

### `close(): void`

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

```

This version:  

- Highlights **features upfront**  
- Shows **installation instructions** clearly  
- Explains **API methods** in a concise section  
- Emphasizes **real-time WebSocket usage**  
- Includes **best practices** (like calling `close()`)  