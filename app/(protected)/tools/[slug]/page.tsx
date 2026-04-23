import { notFound } from 'next/navigation';
import { TOOLS } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import dynamic from 'next/dynamic';

// Dynamically import tool components to keep the bundle small
const ImageCompressor = dynamic(() => import('@/components/tools/image/ImageCompressor'), { ssr: false });
const ImageResizer = dynamic(() => import('@/components/tools/image/ImageResizer'), { ssr: false });
const JPGPNGConverter = dynamic(() => import('@/components/tools/image/JPGPNGConverter'), { ssr: false });
const BackgroundRemover = dynamic(() => import('@/components/tools/image/BackgroundRemover'), { ssr: false });
const ImageCropper = dynamic(() => import('@/components/tools/image/ImageCropper'), { ssr: false });
const ImageToBase64 = dynamic(() => import('@/components/tools/image/ImageToBase64'), { ssr: false });
const WatermarkAdder = dynamic(() => import('@/components/tools/image/WatermarkAdder'), { ssr: false });
const ScreenshotToPDF = dynamic(() => import('@/components/tools/image/ScreenshotToPDF'), { ssr: false });

// Security Tools
const PasswordGenerator = dynamic(() => import('@/components/tools/security/PasswordGenerator'), { ssr: false });
const PasswordStrength = dynamic(() => import('@/components/tools/security/PasswordStrength'), { ssr: false });
const TextEncryptor = dynamic(() => import('@/components/tools/security/TextEncryptor'), { ssr: false });
const Base64Codec = dynamic(() => import('@/components/tools/security/Base64Codec'), { ssr: false });
const HashGenerator = dynamic(() => import('@/components/tools/security/HashGenerator'), { ssr: false });
const UrlEncoder = dynamic(() => import('@/components/tools/security/UrlEncoder'), { ssr: false });
const JwtDecoder = dynamic(() => import('@/components/tools/security/JwtDecoder'), { ssr: false });

// Text Tools
const WordCounter = dynamic(() => import('@/components/tools/text/WordCounter'), { ssr: false });
const CaseConverter = dynamic(() => import('@/components/tools/text/CaseConverter'), { ssr: false });
const RemoveSpaces = dynamic(() => import('@/components/tools/text/RemoveSpaces'), { ssr: false });
const TextSorter = dynamic(() => import('@/components/tools/text/TextSorter'), { ssr: false });
const DuplicateRemover = dynamic(() => import('@/components/tools/text/DuplicateRemover'), { ssr: false });
const TextDiff = dynamic(() => import('@/components/tools/text/TextDiff'), { ssr: false });
const LoremIpsum = dynamic(() => import('@/components/tools/text/LoremIpsum'), { ssr: false });
const CharacterCounter = dynamic(() => import('@/components/tools/text/CharacterCounter'), { ssr: false });


// Developer Tools
const JsonFormatter = dynamic(() => import('@/components/tools/dev/JsonFormatter'), { ssr: false });
const JsonCsvConverter = dynamic(() => import('@/components/tools/dev/JsonCsvConverter'), { ssr: false });
const CodeBeautifier = dynamic(() => import('@/components/tools/dev/CodeBeautifier'), { ssr: false });
const CodeMinifier = dynamic(() => import('@/components/tools/dev/CodeMinifier'), { ssr: false });
const RegexTester = dynamic(() => import('@/components/tools/dev/RegexTester'), { ssr: false });
const UuidGenerator = dynamic(() => import('@/components/tools/dev/UuidGenerator'), { ssr: false });
const ColorPicker = dynamic(() => import('@/components/tools/dev/ColorPicker'), { ssr: false });

// Utility Tools
const QrGenerator = dynamic(() => import('@/components/tools/utility/QrGenerator'), { ssr: false });
const QrScanner = dynamic(() => import('@/components/tools/utility/QrScanner'), { ssr: false });
const UtmGenerator = dynamic(() => import('@/components/tools/utility/UtmGenerator'), { ssr: false });
const RandomNumber = dynamic(() => import('@/components/tools/utility/RandomNumber'), { ssr: false });
const UrlShortener = dynamic(() => import('@/components/tools/utility/UrlShortener'), { ssr: false });

// Life Tools
const AgeCalculator = dynamic(() => import('@/components/tools/life/AgeCalculator'), { ssr: false });
const EmiCalculator = dynamic(() => import('@/components/tools/life/EmiCalculator'), { ssr: false });
const PercentageCalculator = dynamic(() => import('@/components/tools/life/PercentageCalculator'), { ssr: false });
const UnitConverter = dynamic(() => import('@/components/tools/life/UnitConverter'), { ssr: false });

// AI Tools
const AiParaphraser = dynamic(() => import('@/components/tools/ai/AiParaphraser'), { ssr: false });
const AiBioGenerator = dynamic(() => import('@/components/tools/ai/AiBioGenerator'), { ssr: false });

export async function generateMetadata({ params }: ToolPageProps) {
  const tool = TOOLS.find((t) => t.slug === params.slug);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} - Night X Utility Hub`,
    description: tool.description,
    keywords: tool.tags.join(', '),
  };
}

interface ToolPageProps {

  params: {
    slug: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = TOOLS.find((t) => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  // Render the specific tool component based on slug
  const renderTool = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'jpg-png-converter':
        return <JPGPNGConverter />;
      case 'background-remover':
        return <BackgroundRemover />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'image-to-base64':
        return <ImageToBase64 />;
      case 'watermark-adder':
        return <WatermarkAdder />;
      case 'screenshot-to-pdf':
        return <ScreenshotToPDF />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'password-strength':
        return <PasswordStrength />;
      case 'text-encryptor':
        return <TextEncryptor />;
      case 'base64-codec':
        return <Base64Codec />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'jwt-decoder':
        return <JwtDecoder />;
      case 'word-counter':
        return <WordCounter />;
      case 'character-counter':
        return <CharacterCounter />;

      case 'case-converter':
        return <CaseConverter />;
      case 'remove-spaces':
        return <RemoveSpaces />;
      case 'text-sorter':
        return <TextSorter />;
      case 'duplicate-remover':
        return <DuplicateRemover />;
      case 'text-diff':
        return <TextDiff />;
      case 'lorem-ipsum':
        return <LoremIpsum />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'json-csv-converter':
        return <JsonCsvConverter />;
      case 'code-beautifier':
        return <CodeBeautifier />;
      case 'code-minifier':
        return <CodeMinifier />;
      case 'regex-tester':
        return <RegexTester />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'color-picker':
        return <ColorPicker />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'qr-scanner':
        return <QrScanner />;
      case 'utm-generator':
        return <UtmGenerator />;
      case 'random-number':
        return <RandomNumber />;
      case 'url-shortener':
        return <UrlShortener />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'emi-calculator':
        return <EmiCalculator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'ai-paraphraser':
        return <AiParaphraser />;
      case 'ai-bio-generator':
        return <AiBioGenerator />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-syne font-bold mb-2">Coming Soon</h2>
            <p className="text-white/40 max-w-md">
              We are working hard to bring {tool.name} to Night X. Check back shortly!
            </p>
          </div>
        );
    }
  };

  const getHowToUse = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return [
          'Upload one or more images you want to optimize.',
          'Adjust the compression level to balance quality and size.',
          'Download your compressed images instantly.'
        ];
      case 'image-resizer':
        return [
          'Select the image you want to resize.',
          'Enter the new width and height or use a percentage.',
          'Download the perfectly resized image.'
        ];
      case 'jpg-png-converter':
        return [
          'Upload the image you want to convert.',
          'Select your target format (JPG or PNG).',
          'Download your converted file.'
        ];
      case 'background-remover':
        return [
          'Upload an image with a clear foreground subject.',
          'Wait a few seconds for the AI to process.',
          'Download your transparent PNG.'
        ];
      case 'image-cropper':
        return [
          'Upload the image you want to crop.',
          'Adjust the crop area using the handles or presets.',
          'Click "Crop & Download" to save the result.'
        ];
      case 'image-to-base64':
        return [
          'Upload an image from your device.',
          'The tool will automatically convert it to a Base64 string.',
          'Copy the string or download it as a text file.'
        ];
      case 'watermark-adder':
        return [
          'Upload your main image.',
          'Choose between text or an image watermark.',
          'Adjust position, size, and opacity, then download.'
        ];
      case 'screenshot-to-pdf':
        return [
          'Upload one or more images (screenshots).',
          'Rearrange or remove images if necessary.',
          'Click "Combine to PDF" to generate your document.'
        ];
      case 'password-generator':
        return [
          'Choose your desired password length.',
          'Toggle include uppercase, numbers, and symbols.',
          'Click "Generate Password" and copy the result.'
        ];
      case 'password-strength':
        return [
          'Type or paste your password in the input field.',
          'Check the strength meter and estimated crack time.',
          'Review suggestions to improve your password security.'
        ];
      case 'text-encryptor':
        return [
          'Select between Encrypt or Decrypt mode.',
          'Enter your secret key (keep it safe!).',
          'Input the text and click the process button.'
        ];
      case 'base64-codec':
        return [
          'Choose either Encode or Decode mode.',
          'Type or paste your content in the input box.',
          'Copy the resulting Base64 or plain text string.'
        ];
      case 'hash-generator':
        return [
          'Enter the text you want to hash.',
          'Optionally add a secret salt for extra security.',
          'Copy the specific hash format (MD5, SHA-256, etc.) you need.'
        ];
      case 'url-encoder':
        return [
          'Select Encode or Decode mode.',
          'Paste your URL or percent-encoded string.',
          'Copy the result or open the link directly.'
        ];
      case 'jwt-decoder':
        return [
          'Paste your encoded JWT (JSON Web Token).',
          'Inspect the decoded Header and Payload sections.',
          'Check the token expiration status and copy specific data.'
        ];
      case 'word-counter':
        return [
          'Type or paste your text in the input area.',
          'View real-time statistics including word and character count.',
          'Check the estimated reading and speaking time.'
        ];
      case 'character-counter':
        return [
          'Paste or type your text to begin analysis.',
          'Review total characters, spaces, and line counts.',
          'Check the character distribution and composition charts.'
        ];

      case 'case-converter':
        return [
          'Enter your text in the input field.',
          'Click on any conversion mode (UPPERCASE, Title Case, etc.).',
          'The text will be instantly transformed and ready to copy.'
        ];
      case 'remove-spaces':
        return [
          'Paste your text with messy spacing.',
          'Choose a cleaning mode like "Remove Extra Spaces" or "Remove All Spaces".',
          'Review the cleaned text and copy it.'
        ];
      case 'text-sorter':
        return [
          'Enter your list items (one per line).',
          'Select a sorting method (A-Z, Length, Reverse, etc.).',
          'Your list will be reordered instantly.'
        ];
      case 'duplicate-remover':
        return [
          'Paste your list in the input area.',
          'Toggle case sensitivity or line trimming options.',
          'Click "Remove Duplicates" to get a clean list.'
        ];
      case 'text-diff':
        return [
          'Paste the original text in the left panel.',
          'Paste the modified text in the right panel.',
          'Review the differences highlighted in the comparison view.'
        ];
      case 'lorem-ipsum':
        return [
          'Select the number of paragraphs or words you need.',
          'Toggle include HTML tags if needed.',
          'Click generate and copy your placeholder text.'
        ];
      case 'json-formatter':
        return [
          'Paste your raw JSON code into the editor.',
          'Click "Format" to beautify or "Minify" to compress.',
          'The tool will validate your JSON and highlight any syntax errors.'
        ];
      case 'json-csv-converter':
        return [
          'Paste your JSON array or CSV data.',
          'Choose the conversion direction (JSON to CSV or vice versa).',
          'Download the result or copy it to your clipboard.'
        ];
      case 'code-beautifier':
        return [
          'Paste your HTML, CSS, or JavaScript code.',
          'Select your preferred indentation and style options.',
          'Click "Beautify" to get clean, readable code.'
        ];
      case 'code-minifier':
        return [
          'Enter your source code (JS, CSS, or HTML).',
          'Choose minification level (remove comments, whitespace, etc.).',
          'Click "Minify" to optimize your code for production.'
        ];
      case 'regex-tester':
        return [
          'Enter your Regular Expression pattern.',
          'Input the test string you want to match against.',
          'View matches, groups, and explanations in real-time.'
        ];
      case 'uuid-generator':
        return [
          'Select the number of UUIDs you want to generate.',
          'Choose between different versions (v4 is standard).',
          'Copy individual IDs or the entire list.'
        ];
      case 'color-picker':
        return [
          'Use the visual picker to find your perfect color.',
          'Enter a HEX, RGB, or HSL value to convert it.',
          'Copy the color code in the format you need for your CSS.'
        ];
      case 'qr-generator':
        return [
          'Choose the type of data (URL, Text, WiFi, etc.).',
          'Enter the content and adjust colors or size.',
          'Download your custom QR code as PNG or SVG.'
        ];
      case 'qr-scanner':
        return [
          'Grant camera permission to the browser.',
          'Point your camera at a QR code.',
          'The tool will automatically decode and show the hidden content.'
        ];
      case 'utm-generator':
        return [
          'Enter your website URL.',
          'Fill in the campaign source, medium, name, etc.',
          'Copy the final tracked URL for your marketing campaigns.'
        ];
      case 'random-number':
        return [
          'Set your minimum and maximum range.',
          'Select how many numbers you want to generate.',
          'Click "Generate" or use the dice roll feature.'
        ];
      case 'url-shortener':
        return [
          'Paste your long destination URL.',
          'Customize the short alias if available (optional).',
          'Copy your new shortened link to share.'
        ];
      case 'age-calculator':
        return [
          'Select your date of birth.',
          'Choose the target date (default is today).',
          'View your exact age in years, months, and days.'
        ];
      case 'emi-calculator':
        return [
          'Enter the loan amount, interest rate, and tenure.',
          'Select the repayment frequency (usually monthly).',
          'View your EMI and the total interest payable.'
        ];
      case 'percentage-calculator':
        return [
          'Choose the type of calculation (X% of Y, what % is X of Y, etc.).',
          'Enter the numeric values.',
          'Get the result instantly.'
        ];
      case 'unit-converter':
        return [
          'Select the category (Length, Weight, Temp, etc.).',
          'Enter the value in the source unit.',
          'See the converted values in all other units simultaneously.'
        ];
      case 'ai-paraphraser':
        return [
          'Paste the text you want to rewrite.',
          'Choose a tone (Formal, Creative, Casual, etc.).',
          'Click "Rewrite" and get multiple AI-generated variations.'
        ];
      case 'ai-bio-generator':
        return [
          'Enter a few keywords about yourself or your brand.',
          'Select the platform (Instagram, LinkedIn, Twitter).',
          'Generate and copy catchy bios that stand out.'
        ];
      default:
        return [];
    }
  };

  return (
    <ToolPageLayout tool={tool} howToUse={getHowToUse()}>
      {renderTool()}
    </ToolPageLayout>
  );
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}
