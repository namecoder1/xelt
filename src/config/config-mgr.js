import { cosmiconfigSync } from 'cosmiconfig'
import schema from './schema.json' assert { type: 'json' }
import Ajv from 'ajv'
const configLoader = cosmiconfigSync('nxgo');
import betterAjvErrors from 'better-ajv-errors'
import createLogger from '../logger.js'

const ajv = new Ajv();
const logger = createLogger('config-mgr');

export default function getConfig() {
  const result = configLoader.search(process.cwd());
  if (!result) {
    logger.warning('Could not find configuration, using default');
    return { port: 1234 };
  } else {
    const isValid = ajv.validate(schema, result.config);
    if (!isValid) {
      logger.warning('Invalid configuration was supplied');
      console.log(betterAjvErrors(schema, result.config, ajv.errors));
      process.exit(1);
    }
    logger.debug('Found configuration', result.config);
    return result.config;
  }
}