import { devConfig } from './environments/dev';
import { testConfig } from './environments/test';
import { prodConfig } from './environments/prod';

export default () => {
  const nodeEnv = process.env.NODE_ENV;

  switch (nodeEnv) {
    case 'dev':
      return devConfig;
    case 'prod':
      return prodConfig;
    case 'test':
      return testConfig;
    default:
      return devConfig;
  }
};
