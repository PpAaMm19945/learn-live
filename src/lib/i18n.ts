import { create } from 'zustand';

export type Locale = 'en' | 'lg' | 'sw';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  lg: 'Luganda',
  sw: 'Kiswahili',
};

/** Translation dictionary — keys are dot-paths, values per locale */
const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { en: 'Home', lg: 'Ewaka', sw: 'Nyumbani' },
  'nav.glossary': { en: 'Glossary', lg: 'Enkuluze', sw: 'Kamusi' },
  'nav.progress': { en: 'Progress', lg: 'Entambula', sw: 'Maendeleo' },
  'nav.profile': { en: 'Profile', lg: 'Ebikukwatako', sw: 'Wasifu' },
  'nav.settings': { en: 'Settings', lg: 'Entegeka', sw: 'Mipangilio' },
  'nav.sign_out': { en: 'Sign out', lg: 'Fuluma', sw: 'Ondoka' },

  // Auth
  'auth.sign_in': { en: 'Sign In', lg: 'Yingira', sw: 'Ingia' },
  'auth.sign_up': { en: 'Sign Up', lg: 'Wandiika', sw: 'Jisajili' },
  'auth.email': { en: 'Email', lg: 'Email', sw: 'Barua pepe' },
  'auth.password': { en: 'Password', lg: 'Ekigambo ekyama', sw: 'Nenosiri' },
  'auth.forgot_password': { en: 'Forgot password?', lg: 'Ekyama kikusabiriddwa?', sw: 'Umesahau nenosiri?' },

  // Witness / Exam
  'witness.title': { en: 'The Witness', lg: 'Omujulizi', sw: 'Shahidi' },
  'witness.ready': { en: 'Ready for The Witness?', lg: 'Wetegese ku Mujulizi?', sw: 'Tayari kwa Shahidi?' },
  'witness.begin': { en: 'Begin', lg: 'Tandika', sw: 'Anza' },
  'witness.listening': { en: 'Listening…', lg: 'Mpulira…', sw: 'Nasikiliza…' },
  'witness.stop': { en: 'Stop', lg: 'Koma', sw: 'Simama' },
  'witness.evaluating': { en: 'Evaluating responses…', lg: 'Nkebera ebiddamu…', sw: 'Kutathmini majibu…' },
  'witness.complete': { en: 'Witness Complete', lg: 'Omujulizi Amaliriza', sw: 'Shahidi Imekamilika' },
  'witness.return_to_lesson': { en: 'Return to Lesson', lg: 'Ddayo ku Ssomo', sw: 'Rudi kwenye Somo' },
  'witness.review_now': { en: 'Review Assessment Now', lg: 'Kebera Okusaasanya Kati', sw: 'Kagua Tathmini Sasa' },

  // Judgment Modal
  'judgment.title': { en: 'AI Assessment Draft', lg: 'Ekiwandiiko ky\'AI', sw: 'Rasimu ya AI' },
  'judgment.your_judgment': { en: 'Your Judgment', lg: 'Okusalira kwo', sw: 'Uamuzi Wako' },
  'judgment.approve': { en: 'Approve Assessment', lg: 'Kakasa Okusaasanya', sw: 'Idhinisha Tathmini' },
  'judgment.send_back': { en: 'Send Back', lg: 'Ddiza', sw: 'Rudisha' },
  'judgment.approved': { en: 'Approved', lg: 'Kakasiddwa', sw: 'Imeidhinishwa' },
  'judgment.add_notes': { en: 'Add Notes', lg: 'Yongera Ebiwandiiko', sw: 'Ongeza Maelezo' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', lg: 'Ekifo ky\'Okukola', sw: 'Dashibodi' },
  'dashboard.continue_learning': { en: 'Continue Learning', lg: 'Komeka Okusoma', sw: 'Endelea Kujifunza' },
  'dashboard.no_lessons': { en: 'No lessons available yet', lg: 'Tewaliiyo masomo gafuniddwa', sw: 'Hakuna masomo bado' },

  // General
  'general.loading': { en: 'Loading…', lg: 'Ntikka…', sw: 'Inapakia…' },
  'general.error': { en: 'Something went wrong', lg: 'Waliwo ekikyamu', sw: 'Kuna tatizo' },
  'general.retry': { en: 'Try Again', lg: 'Gezaako Nate', sw: 'Jaribu Tena' },
  'general.back': { en: 'Back', lg: 'Emabega', sw: 'Rudi' },
  'general.next': { en: 'Next', lg: 'Ekiddako', sw: 'Ifuatayo' },
  'general.optional': { en: 'Optional', lg: 'Teyeetaagisa', sw: 'Si lazima' },

  // Learner
  'learner.select': { en: 'Select learner', lg: 'Londa omuyizi', sw: 'Chagua mwanafunzi' },
  'learner.band': { en: 'Band', lg: 'Eddaala', sw: 'Kiwango' },
};

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  locale: (typeof window !== 'undefined' && localStorage.getItem('ll-locale') as Locale) || 'en',

  setLocale: (locale: Locale) => {
    localStorage.setItem('ll-locale', locale);
    set({ locale });
  },

  t: (key: string): string => {
    const { locale } = get();
    const entry = translations[key];
    if (!entry) return key;
    return entry[locale] || entry['en'] || key;
  },
}));
