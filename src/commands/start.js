import createLogger from '../logger.js'

export default function start(config) {
	const logger = createLogger('start');
	logger.highlight(' 🚀 Starting the app ')
  logger.debug('Received configuration', config);
}