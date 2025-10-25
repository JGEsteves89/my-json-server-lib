/* eslint-disable no-console */
import MyJSON from 'my-json-server';

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
