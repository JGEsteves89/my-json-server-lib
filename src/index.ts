import { WebSocket } from 'ws';
import type { Socket } from 'node:net';

/**
 * A class to interact with a JSON-based HTTP/WebSocket API.
 * @template T - The type of JSON data expected from the API.
 */
export default class MyJSON<T = Record<string, unknown>> {
  private baseUrl: string;
  private token: string;
  private ws: WebSocket | null = null;

  /**
   * @param baseUrl - The base URL of the API endpoint.
   * @param token - The authentication token required for API access.
   */
  private constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Creates a new instance of MyJSON.
   * @template T
   * @param baseUrl - The base URL of the API endpoint.
   * @param token - The authentication token required for API access.
   * @returns A new instance of MyJSON.
   */
  static connect<T = Record<string, unknown>>(baseUrl: string, token: string): MyJSON<T> {
    return new MyJSON<T>(baseUrl, token);
  }

  /**
   * Reads data from the API.
   * @returns A promise that resolves to the data of type T.
   */
  async read(): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        'x-api-token': this.token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  /**
   * Sends data to the API.
   * @param data - The data to be written to the server.
   * @returns A promise that resolves when the request completes.
   */
  async write(data: T): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'x-api-token': this.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  /**
   * Deletes data from the API.
   * @returns A promise that resolves when the request completes.
   */
  async delete(): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'DELETE',
      headers: {
        'x-api-token': this.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  /**
   * Establishes a WebSocket connection and listens for data changes.
   * @param callback - A function to handle updated data of type T.
   */
  // eslint-disable-next-line no-unused-vars
  onChange(callback: (data: T) => void): void {
    // Convert HTTP/HTTPS URL to WS protocol
    const wsUrl = this.baseUrl.replace(/^https?:/, 'ws:');
    this.ws = new WebSocket(wsUrl, {
      headers: {
        'x-api-token': this.token,
      },
    });

    this.ws.on('open', () => {
      // Access the underlying socket to prevent keeping the process alive
      const socket = (this.ws as unknown as { _socket?: Socket })._socket;
      // unref allows Node to exit even if the socket is open
      socket?.unref();
    });

    this.ws.on('message', (data: Buffer) => {
      try {
        // Parse message and extract data field
        const message = JSON.parse(data.toString());
        callback(message.data);
      } catch (parseError) {
        console.error('Error parsing WebSocket message:', parseError);
      }
    });

    // Log any WebSocket errors
    this.ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Closes the WebSocket connection if active.
   */
  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
