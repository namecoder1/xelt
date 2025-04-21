# xelt

A powerful command-line interface tool for creating Next.js projects with templates and optimizations.

## Features

- Create Next.js projects with TypeScript and Tailwind CSS
- Multiple template support (Default, Supabase, Sanity)
- Project management (list, delete)
- Optimized project creation
- User-specific database storage
- Error handling and logging


## Installation from [npmjs.org](https://www.npmjs.com/package/xelt)

```bash
npm i xelt
```


## Usage

```bash
# Initialize a new project
npx xelt --init --name my-project --template supabase --version 15
```

or 

```bash
npx xelt -i -n my-project -t supabase -v 14
```

## Templates

### Default
- TypeScript
- Tailwind CSS
- ESLint
- App Router

### Supabase
- Supabase client
- Authentication
- Database integration
- Real-time subscriptions

### Sanity
- Sanity client
- Image URL builder
- Portable Text
- Preview Kit

## Development

```bash
# Clone and setup
git clone https://github.com/namecoder1/xelt.git
cd xelt

# Install dependencies
npm install

# Link for local development
npm link

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT