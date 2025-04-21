import arg from 'arg'
import chalk from 'chalk'

// CLI Config Text
const title = chalk.bold.cyan('xelt');
const version = chalk.gray('v1.0.1');
const description = chalk.gray('A powerful CLI tool for creating Next.js projects\n');

// CLI Commands
const commands = [
	{ cmd: '--init, -i', desc: 'Initialize a new project' },
	{ cmd: '--name, -n', desc: 'Project name (used with --init)' },
	{ cmd: '--template, -t', desc: 'Template to use (used with --init)' },
	{ cmd: '--list, -l', desc: 'List all created projects' },
	{ cmd: '--version, -v', desc: 'Version to use (used with --init)' },
	{ cmd: '--view-versions', desc: 'View available versions' },
	{ cmd: '--help, -h', desc: 'Show this help message' }
];

// Parse all possible arguments
const rawArgs = arg({
	'--init': Boolean,
	'--name': String,
	'--template': String,
	'--version': String,
	'--delete-last': Boolean,
	'--delete-all': Boolean,
	'--list': Boolean,
	'--help': Boolean,
	'--view-versions': Boolean,
	'-l': Boolean,
	'-i': Boolean,
	'-n': String,
	'-t': String,
	'-v': String,
	'-h': Boolean
}, {
	permissive: true,
	stopAtPositional: true
});

// Normalize arguments
const args = { ...rawArgs };

// Map short options to long options
if (args['-i']) args['--init'] = true;
if (args['-n']) args['--name'] = args['-n'];
if (args['-t']) args['--template'] = args['-t'];
if (args['-v']) args['--version'] = args['-v'];
if (args['-l']) args['--list'] = true;
if (args['-h']) args['--help'] = true;

// Next.js Available Versions
const versions = [
	'14.2.12',
	'15',
	'15.3.0',
	'latest'
]

export { versions, args, title, version, description, commands }