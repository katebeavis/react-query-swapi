const app = require('./service');

// Listen for incoming HTTP requests
const listener = app.listen(6060 || undefined, () => {
  let host = listener.address().address;
  if (host === '::') {
    host = 'localhost';
  }
  const port = listener.address().port;
  // eslint-disable-next-line no-console
  console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
});
