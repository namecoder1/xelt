import chalk from 'chalk'
import debug from 'debug'

const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARNING: 2,
	ERROR: 3
};

let currentLogLevel = LOG_LEVELS.INFO;

export default function createLogger(name) {
	const debugInstance = debug(name);
	
	return {
		setLogLevel: (level) => {
			currentLogLevel = level;
		},
		log: (...args) => {
			if (currentLogLevel <= LOG_LEVELS.INFO) {
				console.log(chalk.gray(...args));
			}
		},
		warning: (...args) => {
			if (currentLogLevel <= LOG_LEVELS.WARNING) {
				console.log(chalk.yellow(...args));
			}
		},
		highlight: (...args) => {
			if (currentLogLevel <= LOG_LEVELS.INFO) {
				console.log(chalk.bgYellowBright(...args));
			}
		},
		debug: (...args) => {
			if (currentLogLevel <= LOG_LEVELS.DEBUG) {
				debugInstance(...args);
			}
		},
		error: (...args) => {
			if (currentLogLevel <= LOG_LEVELS.ERROR) {
				console.error(chalk.red(...args));
			}
		}
	}
}