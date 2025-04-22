export const sanityTemplate = {
    name: 'sanity',
    description: 'Next.js with Sanity CMS integration',
    dependencies: {
        '14.2.12': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            'sanity',
            '@portabletext/react'
        ],
        '15': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            'sanity',
            '@portabletext/react'
        ],
        'latest': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            'sanity',
            '@portabletext/react'
        ]
    },
    files: {
        '14.2.12': {
            'sanity/lib/client.ts': `
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disabled CDN to prevent stale content
})
`,
            'sanity/lib/image.ts': `
import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
`,
            'sanity/schemaTypes/index.ts': `
import { type SchemaTypeDefinition } from 'sanity'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post],
}
`,
            'sanity/schemaTypes/post.ts': `
import { defineType, defineField } from "sanity";

export const post = defineType({
	name: 'post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title'
			}
		})
	]
})
`,
            'sanity/env.ts': `
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-22'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
`,
            'sanity/structure.ts': `
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Your Project Name')
    .items([
      S.documentTypeListItem('post').title('Blog'),
    ])
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET="production"
`,
            'app/studio/[[...tool]]/page.tsx': `
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
`
        },
        '15': {
            'sanity/lib/client.ts': `
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disabled CDN to prevent stale content
})
`,
            'sanity/lib/image.ts': `
import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
`,
            'sanity/schemaTypes/index.ts': `
import { type SchemaTypeDefinition } from 'sanity'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post],
}
`,
            'sanity/schemaTypes/post.ts': `
import { defineType, defineField } from "sanity";

export const post = defineType({
	name: 'post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title'
			}
		})
	]
})
`,
            'sanity/env.ts': `
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-22'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
`,
            'sanity/structure.ts': `
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Your Project Name')
    .items([
      S.documentTypeListItem('post').title('Blog'),
    ])
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET="production"
`,
            'app/studio/[[...tool]]/page.tsx': `
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
`
        },
        'latest': {
            'sanity/lib/client.ts': `
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disabled CDN to prevent stale content
})
`,
            'sanity/lib/image.ts': `
import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
`,
            'sanity/schemaTypes/index.ts': `
import { type SchemaTypeDefinition } from 'sanity'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post],
}
`,
            'sanity/schemaTypes/post.ts': `
import { defineType, defineField } from "sanity";

export const post = defineType({
	name: 'post',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title'
			}
		})
	]
})
`,
            'sanity/env.ts': `
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-22'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
`,
            'sanity/structure.ts': `
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Your Project Name')
    .items([
      S.documentTypeListItem('post').title('Blog'),
    ])
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET="production"
`,
            'app/studio/[[...tool]]/page.tsx': `
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
`
        }
    }
} 