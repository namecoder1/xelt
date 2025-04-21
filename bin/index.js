#!/usr/bin/env node --no-warnings
import createLogger from '../src/logger.js'
import chalk from 'chalk'
import { versions, args as cliArgs, title, version, description, commands } from '../src/config/data.js'
import create from '../src/commands/create.js'
import { getAllProjects, deleteProject, deleteAllProjects } from '../db/database.js'
const logger = createLogger('bin');
import { printTable } from 'console-table-printer'

// Command handlers with error handling
const COMMAND_HANDLERS = {
	'--init': async (args) => {
		try {
			const version = args['--version'] || versions[0];
			return await create(version, args['--name'], args['--template']);
		} catch (error) {
			logger.error(`Failed to initialize project: ${error.message}`);
			process.exit(1);
		}
	},
	'--list': async (args) => {
		try {
			await listProjects();
		} catch (error) {
			logger.error(`Failed to list projects: ${error.message}`);
			process.exit(1);
		}
	},
	'--delete-last': async (args) => {
		try {
			const projects = await getAllProjects();
			if (projects.length === 0) {
				logger.warning('No projects found to delete');
				return;
			}
			const lastProject = projects[projects.length - 1];
			await deleteProject(lastProject.id);
			logger.log(chalk.green(`Project "${lastProject.name}" deleted successfully`));
		} catch (error) {
			logger.error(`Failed to delete last project: ${error.message}`);
			process.exit(1);
		}
	},
	'--delete-all': async (args) => {
		try {
			const projects = await getAllProjects();
			if (projects.length === 0) {
				logger.warning('No projects found to delete');
				return;
			}
			await deleteAllProjects();
			logger.log(chalk.green('All projects deleted successfully'));
		} catch (error) {
			logger.error(`Failed to delete all projects: ${error.message}`);
			process.exit(1);
		}
	}
};

async function listProjects() {
	const projects = await getAllProjects();
	if (projects.length === 0) {
		logger.log(chalk.gray('No projects found'));
		return;
	}
	
	// Format projects for display
	const formattedProjects = projects.map(project => ({
		ID: project.id,
		Name: project.name,
		Version: project.version,
		Template: project.template,
		Created: new Date(project.created_at).toLocaleString()
	}));
	
	printTable(formattedProjects);
	tableOptions();
}

function printError(error) {
	if (error.code === 'ARG_UNKNOWN_OPTION') {
		logger.error(`Option not valid: ${error.arg}`);
		logger.log(chalk.gray('Use --help to see available options'));
	} else {
		logger.error(error.message);
		if (error.stack && process.env.DEBUG) {
			logger.debug(error.stack);
		}
	}
}

async function main() {
	try {
		const args = cliArgs;
		logger.debug('Received arguments', args);
		
		if (args['--help']) {
			usage(commands);
			process.exit(0);
		}

		if (args['--view-versions']) {
			logger.log(chalk.bgGreenBright(' Available versions: '));
			versions.forEach(v => logger.log(chalk.green(`- ${v}`)));
			process.exit(0);
		}

		// Execute command if found
		for (const [cmd, handler] of Object.entries(COMMAND_HANDLERS)) {
			if (args[cmd]) {
				await handler(args);
				process.exit(0);
			}
		}

		// If no command was executed, show usage
		logger.warning('No command specified');
		usage();
		process.exit(1);
	} catch (error) {
		printError(error);
		usage();
		process.exit(1);
	}
}

function usage(commands = false) {
	console.log(`\n${title} ${version}\n`);
	console.log(commands ? description : chalk.gray('A powerful CLI tool for creating Next.js projects. Use --help or -h to see available commands.'));
	if (commands) availableCommands();
}

function availableCommands() {
	console.log(chalk.bold('Available commands:\n'));
	
	commands.forEach(({ cmd, desc }) => {
		console.log(`  ${chalk.green(cmd.padEnd(25))} ${chalk.gray(desc)}`);
	});
}

function tableOptions() {
	console.log(chalk.bold('Options:'));
	console.log(chalk.gray('  -dl, --delete-last: Delete last project'));
	console.log(chalk.gray('  -dd, --delete-all: Delete all projects'));
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
	printError(error);
	process.exit(1);
});

process.on('unhandledRejection', (error) => {
	printError(error);
	process.exit(1);
});

main();