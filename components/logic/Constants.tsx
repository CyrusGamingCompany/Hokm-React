import {consoleTransport} from 'react-native-logs';

export const loggerConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    state: 4,
    method: 5,
    cards: 6,
    gInfo: 7,
    value: 8,
  },
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'redBright',
      warn: 'yellowBright',
      error: 'redBright',
      state: 'greenBright',
      method: 'magenta',
      cards: 'cyanBright',
      gInfo: 'yellow',
      value: 'green',
    },
    extensionColors: {
      root: 'magenta',
      home: 'green',
    },
  },
};
