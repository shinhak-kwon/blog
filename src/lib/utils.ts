import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateWordCountFromHtml(
  html: string | null | undefined,
): number {
  if (!html) return 0
  const textOnly = html.replace(/<[^>]+>/g, '')
  return textOnly.split(/\s+/).filter(Boolean).length
}

export function readingTime(wordCount: number): string {
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))
  return `${readingTimeMinutes} min read`
}

export function getHeadingMargin(depth: number): string {
  const margins: Record<number, string> = {
    3: 'ml-4',
    4: 'ml-8',
    5: 'ml-12',
    6: 'ml-16',
  }
  return margins[depth] || ''
}

export function formatLink(href: string) {
  if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) return href
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  
  // Ensure we don't double-prepend if the base is '/'
  if (base === '') return href
  
  // If the link is strictly just the base, return it (avoids duplication if input was just '/')
  if (href === '/' && base) return base

  if (!href.startsWith('/')) return href
  
  // CRITICAL FIX: The previous check `if (href.startsWith(base))` was causing false positives 
  // because the collection name 'blog' matches the base path '/blog'. 
  // We must assume all absolute paths passed to this function are intended to be relative to the site root,
  // NOT the domain root, so we always prepend base unless it's literally just a double slash or something weird.
  
  return `${base}${href}`
}
