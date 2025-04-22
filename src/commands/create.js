import { versions } from '../config/data.js'
import chalk from 'chalk'
import createLogger from '../logger.js'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { createProject } from '../../db/database.js'
import ora from 'ora'
import { templates, VALID_TEMPLATES } from '../templates/index.js'

const execAsync = promisify(exec);
const logger = createLogger('create');

class ProjectCreationError extends Error {
	constructor(message, code) {
		super(message);
		this.name = 'ProjectCreationError';
		this.code = code;
	}
}

async function validateInputs(version, projectName, template) {
	if (!versions.includes(version)) {
		throw new ProjectCreationError(
			`Invalid version: ${version}. Available versions: ${versions.join(', ')}`,
			'INVALID_VERSION'
		);
	}

	if (!VALID_TEMPLATES.includes(template)) {
		throw new ProjectCreationError(
			`Invalid template: ${template}. Available templates: ${VALID_TEMPLATES.join(', ')}`,
			'INVALID_TEMPLATE'
		);
	}

	if (!projectName || !/^[a-zA-Z0-9-_]+$/.test(projectName)) {
		throw new ProjectCreationError(
			'Invalid project name. Use only letters, numbers, hyphens and underscores.',
			'INVALID_PROJECT_NAME'
		);
	}
}

async function createNextApp(projectPath, version, template) {
	const baseCommand = `npx -y create-next-app@${version} .`;
	const options = [
		'--typescript',
		'--tailwind',
		'--eslint',
		'--app',
		'--import-alias "@/*"',
		'--no-git',
		'--use-npm',
		'--no-experimental-app'
	];

	if (version !== '14.2.12') {
		options.push('--turbopack');
	}

	const command = `${baseCommand} ${options.join(' ')}`;
	
	try {
		const spinner = ora('Creating Next.js project...').start();
		await execAsync(command, { cwd: projectPath });
		spinner.succeed('Next.js project created successfully!');

		// Install template-specific dependencies
		const selectedTemplate = templates[template];
		const templateVersion = version === 'latest' ? '15' : version;
		const dependencies = selectedTemplate.dependencies[templateVersion] || selectedTemplate.dependencies['14.2.12'];
		
		if (dependencies && dependencies.length > 0) {
			spinner.start('Installing template dependencies...');
			// Use npm install with --no-audit and --no-fund for faster installation
			await execAsync(`npm install --no-audit --no-fund ${dependencies.join(' ')}`, { cwd: projectPath });
			spinner.succeed('Template dependencies installed successfully!');
		}

		// Create template-specific files in parallel
		const files = selectedTemplate.files[templateVersion] || selectedTemplate.files['14.2.12'];
		if (files && Object.keys(files).length > 0) {
			spinner.start('Creating template files...');
			await Promise.all(
				Object.entries(files).map(async ([filePath, content]) => {
					const fullPath = path.join(projectPath, filePath);
					await fs.mkdir(path.dirname(fullPath), { recursive: true });
					await fs.writeFile(fullPath, content.trim());
				})
			);
			spinner.succeed('Template files created successfully!');
		}

		logger.log(chalk.green('✨ Project created successfully!'));
	} catch (error) {
		if (error instanceof ProjectCreationError) {
			throw error;
		}
		throw new ProjectCreationError(
			`Failed to create the project: ${error.message}`,
			'CREATE_FAILED'
		);
	}
}

export default async function create(version, projectName = 'new-project', template = 'default') {
	const startTime = Date.now();
	try {
		await validateInputs(version, projectName, template);

		const projectPath = path.join(os.homedir(), 'Desktop', projectName);

		try {
			await fs.access(projectPath);
			throw new Error(`Directory ${projectName} already exists in Desktop folder`);
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}

		await fs.mkdir(projectPath, { recursive: true });
		logger.log(chalk.green(`✅ Initializing project ${chalk.bold(projectName)} with template ${chalk.greenBright(template)} (${chalk.greenBright('v' + version)})`));

		process.chdir(projectPath);
		await createNextApp(projectPath, version, template);

		await createProject(projectName, version, template);
		
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(1);
		
		logger.log(chalk.cyan('\nTo get started:'));
		logger.log(chalk.gray(`  cd ${projectPath}`));
		logger.log(chalk.gray('  npm run dev'));
		logger.log(chalk.gray(`\n✨ Project created in ${chalk.bold(duration)}s`));

	} catch (error) {
		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(1);
		
		if (error instanceof ProjectCreationError) {
			logger.error(`Error (${error.code}): ${error.message}`);
		} else {
			logger.error(error.message);
		}
		
		logger.log(chalk.gray(`\n❌ Failed after ${chalk.bold(duration)}s`));
		process.exit(1);
	}
}