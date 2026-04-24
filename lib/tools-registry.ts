export type ToolCategory = 'image' | 'security' | 'text' | 'developer' | 'utility' | 'life' | 'ai';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  isAI: boolean;
  isPro: boolean;
  isNew: boolean;
  processingType: 'client' | 'server' | 'api';
  relatedTools: string[];
}

export interface CategoryMeta {
  id: ToolCategory | 'all';
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: 'All Tools', icon: '🛠️', description: 'Everything in one place', color: 'var(--accent-purple)' },
  { id: 'image', label: 'Image Tools', icon: '🖼️', description: 'Compress, resize, and convert images', color: 'var(--accent-cyan)' },
  { id: 'security', label: 'Security', icon: '🛡️', description: 'Passwords, encryption, and hashing', color: '#EF4444' },
  { id: 'text', label: 'Text Utilities', icon: '📝', description: 'Case conversion, word counts, and formatting', color: '#10B981' },
  { id: 'developer', label: 'For Developers', icon: '💻', description: 'JSON, regex, and code tools', color: '#F59E0B' },
  { id: 'utility', label: 'Utilities', icon: '⚙️', description: 'QR codes, short links, and more', color: '#6366F1' },
  { id: 'life', label: 'Daily Life', icon: '📅', description: 'Calculators and everyday helpers', color: '#EC4899' },
  { id: 'ai', label: 'AI Tools', icon: '🤖', description: 'AI-powered writing and assistant tools', color: '#8B5CF6' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Optimize and reduce JPG/PNG file sizes without losing quality.',
    category: 'image',
    icon: '🗜️',
    tags: ['compress', 'optimize', 'reduce size', 'jpg', 'png', 'image'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['image-resizer', 'jpg-png-converter', 'background-remover']
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Change image dimensions with pixel-perfect precision.',
    category: 'image',
    icon: '↔️',
    tags: ['resize', 'dimensions', 'width', 'height'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['image-compressor', 'image-cropper']
  },
  {
    slug: 'jpg-png-converter',
    name: 'JPG/PNG Converter',
    description: 'Instantly convert images between JPG and PNG formats.',
    category: 'image',
    icon: '🔄',
    tags: ['convert', 'jpg', 'png', 'format'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['image-compressor', 'image-to-base64']
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove backgrounds from images automatically using AI.',
    category: 'image',
    icon: '✂️',
    tags: ['background', 'remove', 'transparent', 'ai'],
    isAI: true, isPro: true, isNew: true,
    processingType: 'client',
    relatedTools: ['image-compressor', 'ai-paraphraser']
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop and trim images to any aspect ratio.',
    category: 'image',
    icon: '✂️',
    tags: ['crop', 'trim', 'aspect ratio'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['image-resizer', 'watermark-adder']
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 strings for CSS or HTML embedding.',
    category: 'image',
    icon: '📦',
    tags: ['base64', 'encode', 'data url'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['jpg-png-converter', 'base64-codec']
  },
  {
    slug: 'watermark-adder',
    name: 'Watermark Adder',
    description: 'Add text or logo watermarks to protect your images.',
    category: 'image',
    icon: '🔏',
    tags: ['watermark', 'brand', 'protect'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['image-cropper', 'image-compressor']
  },
  {
    slug: 'screenshot-to-pdf',
    name: 'Screenshot to PDF',
    description: 'Convert screenshots or images into a clean PDF document.',
    category: 'image',
    icon: '📄',
    tags: ['pdf', 'screenshot', 'convert'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['jpg-png-converter', 'image-to-base64']
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong random passwords for your accounts.',
    category: 'security',
    icon: '🔑',
    tags: ['password', 'generate', 'secure', 'random'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['password-strength', 'text-obfuscator']
  },
  {
    slug: 'password-strength',
    name: 'Password Strength',
    description: 'Estimate how strong a password is against common attacks.',
    category: 'security',
    icon: '💪',
    tags: ['password', 'strength', 'check', 'security'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['password-generator', 'hash-generator']
  },
  {
    slug: 'text-obfuscator',
    name: 'Text Obfuscator',
    description: 'Securely obfuscate and de-obfuscate text using AES-256 protocols.',
    category: 'security',
    icon: '🔒',
    tags: ['encrypt', 'decrypt', 'aes', 'secure', 'obfuscate'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['password-generator', 'base64-codec']
  },
  {
    slug: 'base64-codec',
    name: 'Base64 Codec',
    description: 'Fast encoding and decoding for Base64 data strings.',
    category: 'security',
    icon: '⚡',
    tags: ['base64', 'encode', 'decode'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['url-encoder', 'text-obfuscator']
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA256, and SHA512 hashes for text.',
    category: 'security',
    icon: '#️⃣',
    tags: ['hash', 'md5', 'sha256', 'sha512'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['password-strength', 'jwt-decoder']
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder',
    description: 'Safely encode or decode URLs for web compatibility.',
    category: 'security',
    icon: '🔗',
    tags: ['url', 'encode', 'decode', 'percent'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['base64-codec', 'utm-generator']
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens instantly.',
    category: 'security',
    icon: '🎫',
    tags: ['jwt', 'token', 'decode', 'json web token'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['json-formatter', 'hash-generator']
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and reading time in your text.',
    category: 'text',
    icon: '📝',
    tags: ['word', 'count', 'characters', 'reading time'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['character-counter', 'case-converter']
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    description: 'Quickly count every character and letter in your content.',
    category: 'text',
    icon: '🔢',
    tags: ['character', 'count', 'letters', 'length'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'remove-spaces']
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text to uppercase, lowercase, title case, and more.',
    category: 'text',
    icon: 'Aa',
    tags: ['case', 'upper', 'lower', 'title', 'camel', 'snake'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'remove-spaces']
  },
  {
    slug: 'remove-spaces',
    name: 'Remove Spaces',
    description: 'Clean up text by removing extra spaces and line breaks.',
    category: 'text',
    icon: '⎵',
    tags: ['spaces', 'trim', 'clean', 'whitespace'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['case-converter', 'text-sorter']
  },
  {
    slug: 'text-sorter',
    name: 'Text Sorter',
    description: 'Sort lines of text alphabetically or numerically.',
    category: 'text',
    icon: '↕️',
    tags: ['sort', 'lines', 'alphabetical', 'order'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['duplicate-remover', 'remove-spaces']
  },
  {
    slug: 'duplicate-remover',
    name: 'Duplicate Remover',
    description: 'Clean lists by removing duplicate lines.',
    category: 'text',
    icon: '🗑️',
    tags: ['duplicate', 'remove', 'unique', 'lines'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['text-sorter', 'word-counter']
  },
  {
    slug: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two texts to find differences and similarities.',
    category: 'text',
    icon: '⚖️',
    tags: ['diff', 'compare', 'difference', 'text'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'text-sorter']
  },
  {
    slug: 'markdown-live',
    name: 'Markdown Live',
    description: 'Real-time markdown preview with integrated XSS sanitization.',
    category: 'text',
    icon: '📝',
    tags: ['markdown', 'preview', 'editor', 'xss', 'sanitize'],
    isAI: false, isPro: false, isNew: true,
    processingType: 'client',
    relatedTools: ['word-counter', 'text-diff']
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text for designs and layouts.',
    category: 'text',
    icon: '📜',
    tags: ['lorem', 'ipsum', 'placeholder', 'dummy text'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'case-converter']
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify, validate, and minify your JSON data.',
    category: 'developer',
    icon: '{}',
    tags: ['json', 'format', 'validate', 'pretty print'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['json-csv-converter', 'jwt-decoder']
  },
  {
    slug: 'json-csv-converter',
    name: 'JSON/CSV Converter',
    description: 'Transform data between JSON and CSV formats.',
    category: 'developer',
    icon: '📊',
    tags: ['json', 'csv', 'convert', 'table'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['json-formatter', 'code-beautifier']
  },
  {
    slug: 'code-beautifier',
    name: 'Code Beautifier',
    description: 'Format HTML, CSS, and JavaScript for better readability.',
    category: 'developer',
    icon: '✨',
    tags: ['beautify', 'format', 'html', 'css', 'js', 'prettier'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['code-minifier', 'json-formatter']
  },
  {
    slug: 'code-minifier',
    name: 'Code Minifier',
    description: 'Compress JS, CSS, and HTML code for production use.',
    category: 'developer',
    icon: '📦',
    tags: ['minify', 'compress', 'js', 'css', 'html'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'uuid-generator']
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Write and test regular expressions with live highlighting.',
    category: 'developer',
    icon: '🔍',
    tags: ['regex', 'regexp', 'pattern', 'test', 'match'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'uuid-generator']
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID v4 identifiers for development work.',
    category: 'developer',
    icon: '🆔',
    tags: ['uuid', 'guid', 'unique id', 'generate'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['code-minifier', 'random-number']
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Find and convert colors in HEX, RGB, and HSL formats.',
    category: 'developer',
    icon: '🎨',
    tags: ['color', 'hex', 'rgb', 'hsl', 'picker'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'image-cropper']
  },
  {
    slug: 'qr-generator',
    name: 'QR Generator',
    description: 'Generate custom QR codes for URLs, text, and Wi-Fi.',
    category: 'utility',
    icon: '📱',
    tags: ['qr', 'code', 'generate', 'scan'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['qr-scanner', 'url-shortener']
  },
  {
    slug: 'qr-scanner',
    name: 'QR Scanner',
    description: 'Scan and decode QR codes using your device camera.',
    category: 'utility',
    icon: '📸',
    tags: ['qr', 'scan', 'camera', 'decode'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['qr-generator', 'url-encoder']
  },
  {
    slug: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short links from long URLs with a basic click count.',
    category: 'utility',
    icon: '✂️',
    tags: ['url', 'shorten', 'link', 'short'],
    isAI: false, isPro: true, isNew: true,
    processingType: 'api',
    relatedTools: ['qr-generator', 'utm-generator']
  },
  {
    slug: 'utm-generator',
    name: 'UTM Generator',
    description: 'Build marketing URLs with UTM tracking parameters.',
    category: 'utility',
    icon: '📈',
    tags: ['utm', 'link', 'tracking', 'marketing'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['url-shortener', 'url-encoder']
  },
  {
    slug: 'random-number',
    name: 'Random Number',
    description: 'Generate random numbers or roll virtual dice.',
    category: 'utility',
    icon: '🎲',
    tags: ['random', 'number', 'generate', 'dice'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['uuid-generator', 'password-generator']
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age in years, months, and days.',
    category: 'life',
    icon: '🎂',
    tags: ['age', 'birthday', 'calculate', 'years'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['emi-calculator', 'percentage-calculator']
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate monthly loan repayments with interest rates.',
    category: 'life',
    icon: '💰',
    tags: ['emi', 'loan', 'interest', 'calculator', 'india'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['percentage-calculator', 'age-calculator']
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Perform percentage math and discount calculations.',
    category: 'life',
    icon: '%',
    tags: ['percentage', 'percent', 'calculate', 'math'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['unit-converter', 'emi-calculator']
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between length, weight, and temperature units.',
    category: 'life',
    icon: '⚖️',
    tags: ['unit', 'convert', 'length', 'weight', 'temperature'],
    isAI: false, isPro: false, isNew: false,
    processingType: 'client',
    relatedTools: ['percentage-calculator', 'random-number']
  },
  {
    slug: 'ai-paraphraser',
    name: 'AI Paraphraser',
    description: 'Rewrite and rephrase text using AI.',
    category: 'ai',
    icon: '🤖',
    tags: ['paraphrase', 'rewrite', 'ai', 'rephrase'],
    isAI: true, isPro: true, isNew: true,
    processingType: 'api',
    relatedTools: ['ai-bio-generator', 'word-counter']
  },
  {
    slug: 'ai-bio-generator',
    name: 'AI Bio Generator',
    description: 'Generate social bio ideas from your keywords and tone.',
    category: 'ai',
    icon: '✍️',
    tags: ['bio', 'caption', 'ai', 'generate', 'instagram', 'linkedin'],
    isAI: true, isPro: true, isNew: true,
    processingType: 'api',
    relatedTools: ['ai-paraphraser', 'word-counter']
  }
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory | 'all'): Tool[] {
  if (category === 'all') return TOOLS;
  return TOOLS.filter((tool) => tool.category === category);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return TOOLS.filter((tool) =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((t): t is Tool => !!t);
}
