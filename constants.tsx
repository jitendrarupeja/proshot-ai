
import { ProfessionalStyle } from './types';

export const PROFESSIONAL_STYLES: ProfessionalStyle[] = [
  {
    id: 'corporate',
    name: 'Corporate Studio',
    description: 'Classic grey backdrop with studio lighting.',
    prompt: 'Professional corporate headshot, suit and tie or professional dress, neutral grey studio backdrop, high-end commercial photography, sharp focus, 8k resolution, studio lighting.',
    previewUrl: 'https://picsum.photos/seed/corp/400/500'
  },
  {
    id: 'tech',
    name: 'Modern Tech Office',
    description: 'Casual professional in a bright, modern office.',
    prompt: 'Modern tech professional headshot, casual professional attire, blurred office background with glass walls and plants, soft natural indoor lighting, vibrant and clean aesthetic.',
    previewUrl: 'https://picsum.photos/seed/tech/400/500'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Natural',
    description: 'Soft lighting in a natural park setting.',
    prompt: 'Natural light professional headshot, outdoor park setting, soft sunlight, blurred greenery in the background, professional portrait, warm and friendly expression.',
    previewUrl: 'https://picsum.photos/seed/park/400/500'
  },
  {
    id: 'luxury',
    name: 'Executive Suite',
    description: 'Elegant boardroom or executive lounge setting.',
    prompt: 'Executive headshot, luxury office setting, high-end wooden desk and leather chair in soft focus background, sophisticated lighting, powerful and confident professional look.',
    previewUrl: 'https://picsum.photos/seed/exec/400/500'
  }
];
