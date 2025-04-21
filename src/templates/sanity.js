export const sanityTemplate = {
    name: 'sanity',
    description: 'Next.js with Sanity CMS integration',
    dependencies: {
        '14.2.12': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            '@portabletext/react'
        ],
        '15': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            '@portabletext/react',
            '@sanity/preview-kit'
        ],
        'latest': [
            '@sanity/client',
            '@sanity/image-url',
            'next-sanity',
            '@portabletext/react',
            '@sanity/preview-kit'
        ]
    },
    files: {
        '14.2.12': {
            'src/lib/sanity.js': `
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-21',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
`,
            'src/app/api/sanity/route.js': `
import { createClient } from '@sanity/client'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-21',
  useCdn: true,
})

export async function GET() {
  try {
    const query = \`*[_type == "post"]\`
    const posts = await client.fetch(query)
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
`
        },
        '15': {
            'src/lib/sanity.js': `
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { unstable_noStore as noStore } from 'next/cache'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-21',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-21
`,
            'src/app/api/sanity/route.js': `
import { createClient } from '@sanity/client'
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
})

export async function GET() {
  noStore()
  try {
    const query = \`*[_type == "post"]\`
    const posts = await client.fetch(query)
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
`
        },
        'latest': {
            'src/lib/sanity.js': `
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { unstable_noStore as noStore } from 'next/cache'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-21',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
`,
            '.env.local': `
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-21
`,
            'src/app/api/sanity/route.js': `
import { createClient } from '@sanity/client'
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
})

export async function GET() {
  noStore()
  try {
    const query = \`*[_type == "post"]\`
    const posts = await client.fetch(query)
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
`
        }
    }
} 