export type ToolCategory = 'image' | 'security' | 'text' | 'developer' | 'utility' | 'life' | 'ai';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  isAI: boolean;
  isPro?: boolean;
  isNew?: boolean;
  isPublic: boolean;
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
  { id: 'all', label: 'All Tools', icon: 'Wrench', description: 'Everything in one place', color: '#F59E0B' },
  { id: 'image', label: 'Image Tools', icon: 'Image', description: 'Compress, resize, and convert images', color: '#06B6D4' },
  { id: 'security', label: 'Security & Crypto', icon: 'Shield', description: 'Passwords, encryption, and hashing', color: '#EF4444' },
  { id: 'text', label: 'Text Utilities', icon: 'FileText', description: 'Case conversion, word counts, and formatting', color: '#10B981' },
  { id: 'developer', label: 'For Developers', icon: 'TerminalSquare', description: 'JSON, regex, and code tools', color: '#F59E0B' },
  { id: 'utility', label: 'Utilities', icon: 'Settings', description: 'QR codes, short links, and more', color: '#8B5CF6' },
  { id: 'life', label: 'Daily Life', icon: 'Calendar', description: 'Calculators and everyday helpers', color: '#EC4899' },
  { id: 'ai', label: 'AI Tools', icon: 'Bot', description: 'AI-powered writing and assistant tools', color: '#F97316' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Optimize and reduce JPG/PNG file sizes without losing visual quality.',
    category: 'image',
    icon: 'Minimize',
    tags: ['compress', 'optimize', 'reduce size', 'jpg', 'png', 'image'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['image-resizer', 'jpg-png-converter', 'background-remover']
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Change image dimensions with pixel-perfect precision.',
    category: 'image',
    icon: 'MoveHorizontal',
    tags: ['resize', 'dimensions', 'width', 'height'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['image-compressor', 'image-cropper']
  },
  {
    slug: 'jpg-png-converter',
    name: 'JPG/PNG Converter',
    description: 'Instantly convert images between JPG and PNG formats.',
    category: 'image',
    icon: 'RefreshCcw',
    tags: ['convert', 'jpg', 'png', 'format'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['image-compressor', 'image-to-base64']
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove backgrounds from images automatically in your browser.',
    category: 'image',
    icon: 'Scissors',
    tags: ['background', 'remove', 'transparent', 'ai'],
    isAI: true, isPublic: false,
    processingType: 'client',
    relatedTools: ['image-compressor', 'image-cropper']
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop and trim images to any aspect ratio with live preview.',
    category: 'image',
    icon: 'Scissors',
    tags: ['crop', 'trim', 'aspect ratio'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['image-resizer', 'watermark-adder']
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 data strings for CSS or HTML embedding.',
    category: 'image',
    icon: 'Archive',
    tags: ['base64', 'encode', 'data url'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['jpg-png-converter', 'base64-codec']
  },
  {
    slug: 'watermark-adder',
    name: 'Watermark Adder',
    description: 'Add custom text or image watermarks to protect your media.',
    category: 'image',
    icon: 'Stamp',
    tags: ['watermark', 'brand', 'protect'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['image-cropper', 'image-compressor']
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert screenshots or photos into a clean multi-page PDF document.',
    category: 'image',
    icon: 'FileOutput',
    tags: ['pdf', 'images', 'convert'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['jpg-png-converter', 'image-to-base64']
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create cryptographically strong random passwords and passphrases.',
    category: 'security',
    icon: 'KeyRound',
    tags: ['password', 'generate', 'secure', 'random'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['password-strength', 'text-obfuscator']
  },
  {
    slug: 'password-strength',
    name: 'Password Strength',
    description: 'Evaluate password entropy and resistance against brute-force attacks.',
    category: 'security',
    icon: 'Activity',
    tags: ['password', 'strength', 'check', 'security'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['password-generator', 'hash-generator']
  },
  {
    slug: 'text-obfuscator',
    name: 'Text Obfuscator',
    description: 'Securely encrypt and decrypt text payloads using AES-256 protocols.',
    category: 'security',
    icon: 'Lock',
    tags: ['encrypt', 'decrypt', 'aes', 'secure', 'obfuscate'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['password-generator', 'base64-codec']
  },
  {
    slug: 'base64-codec',
    name: 'Base64 Codec',
    description: 'Fast UTF-8 encoding and decoding for Base64 data strings.',
    category: 'security',
    icon: 'Zap',
    tags: ['base64', 'encode', 'decode'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['url-encoder', 'text-obfuscator']
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-256, and SHA-512 cryptographic hashes with optional salt.',
    category: 'security',
    icon: 'Hash',
    tags: ['hash', 'md5', 'sha256', 'sha512'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['password-strength', 'jwt-decoder']
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder',
    description: 'Safely percent-encode or decode URLs for web compatibility.',
    category: 'security',
    icon: 'Link',
    tags: ['url', 'encode', 'decode', 'percent'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['base64-codec', 'utm-generator']
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode, inspect, and verify claims in JSON Web Tokens.',
    category: 'security',
    icon: 'Ticket',
    tags: ['jwt', 'token', 'decode', 'json web token'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['json-formatter', 'hash-generator']
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Analyze word count, character density, and estimated reading time.',
    category: 'text',
    icon: 'FileText',
    tags: ['word', 'count', 'characters', 'reading time'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['character-counter', 'case-converter']
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    description: 'Detailed character, letter, digit, whitespace, and line metrics.',
    category: 'text',
    icon: 'Binary',
    tags: ['character', 'count', 'letters', 'length'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['word-counter', 'remove-spaces']
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text to UPPERCASE, lowercase, Title Case, camelCase, and snake_case.',
    category: 'text',
    icon: 'CaseUpper',
    tags: ['case', 'upper', 'lower', 'title', 'camel', 'snake'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['word-counter', 'remove-spaces']
  },
  {
    slug: 'remove-spaces',
    name: 'Remove Spaces',
    description: 'Clean up formatting by trimming extra spaces and blank lines.',
    category: 'text',
    icon: 'Space',
    tags: ['spaces', 'trim', 'clean', 'whitespace'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['case-converter', 'text-sorter']
  },
  {
    slug: 'text-sorter',
    name: 'Text Sorter',
    description: 'Sort lines alphabetically, numerically, by length, or reversed.',
    category: 'text',
    icon: 'ArrowUpDown',
    tags: ['sort', 'lines', 'alphabetical', 'order'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['duplicate-remover', 'remove-spaces']
  },
  {
    slug: 'duplicate-remover',
    name: 'Duplicate Remover',
    description: 'Deduplicate text lines with case sensitivity and trimming options.',
    category: 'text',
    icon: 'Trash2',
    tags: ['duplicate', 'remove', 'unique', 'lines'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['text-sorter', 'word-counter']
  },
  {
    slug: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two text versions with side-by-side and inline difference highlights.',
    category: 'text',
    icon: 'Scale',
    tags: ['diff', 'compare', 'difference', 'text'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'text-sorter']
  },
  {
    slug: 'markdown-live',
    name: 'Markdown Live',
    description: 'Real-time Markdown editor with live preview and XSS sanitization.',
    category: 'text',
    icon: 'FileText',
    tags: ['markdown', 'preview', 'editor', 'xss', 'sanitize'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['word-counter', 'text-diff']
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Generate customizable placeholder text paragraphs, sentences, and lists.',
    category: 'text',
    icon: 'ScrollText',
    tags: ['lorem', 'ipsum', 'placeholder', 'dummy text'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['word-counter', 'case-converter']
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Validate, beautify, and minify JSON data with instant syntax checks.',
    category: 'developer',
    icon: 'Braces',
    tags: ['json', 'format', 'validate', 'pretty print'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['json-csv-converter', 'jwt-decoder']
  },
  {
    slug: 'json-csv-converter',
    name: 'JSON/CSV Converter',
    description: 'Bi-directional data converter between JSON arrays and CSV tables.',
    category: 'developer',
    icon: 'TableProperties',
    tags: ['json', 'csv', 'convert', 'table'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['json-formatter', 'code-beautifier']
  },
  {
    slug: 'code-beautifier',
    name: 'Code Beautifier',
    description: 'Format HTML, CSS, and JavaScript with custom indentation.',
    category: 'developer',
    icon: 'Wand2',
    tags: ['beautify', 'format', 'html', 'css', 'js', 'prettier'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['code-minifier', 'json-formatter']
  },
  {
    slug: 'code-minifier',
    name: 'Code Minifier',
    description: 'Strip comments and compress HTML, CSS, and JS for production.',
    category: 'developer',
    icon: 'Archive',
    tags: ['minify', 'compress', 'js', 'css', 'html'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'uuid-generator']
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with real-time match highlighting and capture groups.',
    category: 'developer',
    icon: 'TextSearch',
    tags: ['regex', 'regexp', 'pattern', 'test', 'match'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'uuid-generator']
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate bulk UUID v4 unique identifiers for databases and testing.',
    category: 'developer',
    icon: 'Fingerprint',
    tags: ['uuid', 'guid', 'unique id', 'generate'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['code-minifier', 'random-number']
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'Explore palette harmonies and convert between HEX, RGB, and HSL formats.',
    category: 'developer',
    icon: 'Palette',
    tags: ['color', 'hex', 'rgb', 'hsl', 'picker'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['code-beautifier', 'image-cropper']
  },
  {
    slug: 'qr-generator',
    name: 'QR Generator',
    description: 'Generate high-resolution QR codes for URLs, text, and Wi-Fi networks.',
    category: 'utility',
    icon: 'QrCode',
    tags: ['qr', 'code', 'generate', 'scan'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['qr-scanner', 'url-shortener']
  },
  {
    slug: 'qr-scanner',
    name: 'QR Scanner',
    description: 'Scan and decode QR codes instantly using your device camera or image file.',
    category: 'utility',
    icon: 'ScanLine',
    tags: ['qr', 'scan', 'camera', 'decode'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['qr-generator', 'url-encoder']
  },
  {
    slug: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create fast, private short links with custom aliases and click tracking.',
    category: 'utility',
    icon: 'Scissors',
    tags: ['url', 'shorten', 'link', 'short'],
    isAI: false, isPublic: false,
    processingType: 'api',
    relatedTools: ['qr-generator', 'utm-generator']
  },
  {
    slug: 'utm-generator',
    name: 'UTM Generator',
    description: 'Construct campaign URLs with standardized UTM marketing parameters.',
    category: 'utility',
    icon: 'TrendingUp',
    tags: ['utm', 'link', 'tracking', 'marketing'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['url-shortener', 'url-encoder']
  },
  {
    slug: 'random-number',
    name: 'Random Number',
    description: 'Generate secure random numbers, ranges, and virtual dice rolls.',
    category: 'utility',
    icon: 'Dices',
    tags: ['random', 'number', 'generate', 'dice'],
    isAI: false, isPublic: false,
    processingType: 'client',
    relatedTools: ['uuid-generator', 'password-generator']
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, and days with milestone statistics.',
    category: 'life',
    icon: 'Cake',
    tags: ['age', 'birthday', 'calculate', 'years'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['emi-calculator', 'percentage-calculator']
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate loan EMI payments, total interest breakdown, and repayment schedules.',
    category: 'life',
    icon: 'Banknote',
    tags: ['emi', 'loan', 'interest', 'calculator'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['percentage-calculator', 'age-calculator']
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, discounts, and markup.',
    category: 'life',
    icon: 'Percent',
    tags: ['percentage', 'percent', 'calculate', 'math'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['unit-converter', 'emi-calculator']
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between length, weight, area, volume, and temperature units.',
    category: 'life',
    icon: 'Scale',
    tags: ['unit', 'convert', 'length', 'weight', 'temperature'],
    isAI: false, isPublic: true,
    processingType: 'client',
    relatedTools: ['percentage-calculator', 'random-number']
  },
  {
    slug: 'ai-paraphraser',
    name: 'AI Paraphraser',
    description: 'Rewrite, simplify, or rephrase text with customizable tone settings.',
    category: 'ai',
    icon: 'Bot',
    tags: ['paraphrase', 'rewrite', 'ai', 'rephrase'],
    isAI: true, isPublic: false,
    processingType: 'api',
    relatedTools: ['ai-bio-generator', 'word-counter']
  },
  {
    slug: 'ai-bio-generator',
    name: 'AI Bio Generator',
    description: 'Generate concise bios and social profile summaries for GitHub, X, and LinkedIn.',
    category: 'ai',
    icon: 'PenTool',
    tags: ['bio', 'caption', 'ai', 'generate', 'linkedin'],
    isAI: true, isPublic: false,
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
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return TOOLS;
  return TOOLS.filter((tool) =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
    tool.category.toLowerCase().includes(lowerQuery)
  );
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((t): t is Tool => !!t);
}
