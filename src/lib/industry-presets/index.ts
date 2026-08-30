import { IndustryPreset } from './types';
import { barbershopPreset } from './barbershop.preset';
import { cosmeticsPreset } from './cosmetics.preset';
import { nailsBeautyPreset } from './nails.preset';
import { spaMassagePreset } from './spa.preset';
import { tattooPiercingPreset } from './tattoo.preset';
import { fitnessTrainerPreset } from './fitness.preset';
import { clinicsAestheticsPreset } from './clinics.preset';
import { homeTechnicianPreset } from './technician.preset';

export * from './types';
export {
  barbershopPreset,
  cosmeticsPreset,
  nailsBeautyPreset,
  spaMassagePreset,
  tattooPiercingPreset,
  fitnessTrainerPreset,
  clinicsAestheticsPreset,
  homeTechnicianPreset,
};

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  barbershopPreset,
  cosmeticsPreset,
  nailsBeautyPreset,
  spaMassagePreset,
  tattooPiercingPreset,
  fitnessTrainerPreset,
  clinicsAestheticsPreset,
  homeTechnicianPreset,
];
