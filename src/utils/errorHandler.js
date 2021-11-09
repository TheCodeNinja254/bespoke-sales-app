const errorHandler = (message) => {
  if (
    typeof message === 'object' &&
    'type' in message &&
    message.type === 'span'
  ) {
    return message;
  }

  const string = message ? message.toString() : '';
  return string.replace('GraphQL error: ', '');
};

export default errorHandler;
