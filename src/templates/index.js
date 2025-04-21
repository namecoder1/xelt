import { supabaseTemplate } from './supabase.js'
import { sanityTemplate } from './sanity.js'

// Template validation
function validateTemplate(template) {
    const requiredFields = ['name', 'description', 'dependencies', 'files'];
    for (const field of requiredFields) {
        if (!(field in template)) {
            throw new Error(`Template is missing required field: ${field}`);
        }
    }
}

// Validate all templates
const templates = {
    default: {
        name: 'default',
        description: 'Default Next.js template with TypeScript and Tailwind',
        dependencies: {
            '14.2.12': [],
            '15': [],
            'latest': []
        },
        files: {
            '14.2.12': {},
            '15': {},
            'latest': {}
        }
    },
    supabase: supabaseTemplate,
    sanity: sanityTemplate
};

// Validate all templates
Object.entries(templates).forEach(([name, template]) => {
    try {
        validateTemplate(template);
    } catch (error) {
        throw new Error(`Invalid template ${name}: ${error.message}`);
    }
});

export const VALID_TEMPLATES = Object.keys(templates);

export { templates }; 