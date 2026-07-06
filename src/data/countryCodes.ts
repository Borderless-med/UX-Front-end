/**
 * International Country Codes for Phone Numbers
 * 
 * Usage: Import this constant in any form that requires country code selection
 * - Singapore & Malaysia are pinned at the top (99% of users)
 * - Comprehensive international coverage for medical tourists
 * - Maintains consistent UI/UX across all forms
 */

export interface CountryCode {
  value: string;
  label: string;
  flag?: string;
}

export const countryCodes: CountryCode[] = [
  // ========== PRIORITY COUNTRIES (Pinned at Top) ==========
  { value: '+65', label: '🇸🇬 Singapore (+65)', flag: '🇸🇬' },
  { value: '+60', label: '🇲🇾 Malaysia (+60)', flag: '🇲🇾' },
  
  // ========== SEPARATOR (for visual grouping in UI) ==========
  // Note: Add divider in SelectContent if needed
  
  // ========== ASEAN COUNTRIES ==========
  { value: '+673', label: '🇧🇳 Brunei (+673)', flag: '🇧🇳' },
  { value: '+855', label: '🇰🇭 Cambodia (+855)', flag: '🇰🇭' },
  { value: '+62', label: '🇮🇩 Indonesia (+62)', flag: '🇮🇩' },
  { value: '+856', label: '🇱🇦 Laos (+856)', flag: '🇱🇦' },
  { value: '+95', label: '🇲🇲 Myanmar (+95)', flag: '🇲🇲' },
  { value: '+63', label: '🇵🇭 Philippines (+63)', flag: '🇵🇭' },
  { value: '+66', label: '🇹🇭 Thailand (+66)', flag: '🇹🇭' },
  { value: '+84', label: '🇻🇳 Vietnam (+84)', flag: '🇻🇳' },
  
  // ========== MAJOR ASIA-PACIFIC ==========
  { value: '+61', label: '🇦🇺 Australia (+61)', flag: '🇦🇺' },
  { value: '+86', label: '🇨🇳 China (+86)', flag: '🇨🇳' },
  { value: '+852', label: '🇭🇰 Hong Kong (+852)', flag: '🇭🇰' },
  { value: '+91', label: '🇮🇳 India (+91)', flag: '🇮🇳' },
  { value: '+81', label: '🇯🇵 Japan (+81)', flag: '🇯🇵' },
  { value: '+853', label: '🇲🇴 Macau (+853)', flag: '🇲🇴' },
  { value: '+64', label: '🇳🇿 New Zealand (+64)', flag: '🇳🇿' },
  { value: '+92', label: '🇵🇰 Pakistan (+92)', flag: '🇵🇰' },
  { value: '+82', label: '🇰🇷 South Korea (+82)', flag: '🇰🇷' },
  { value: '+94', label: '🇱🇰 Sri Lanka (+94)', flag: '🇱🇰' },
  { value: '+886', label: '🇹🇼 Taiwan (+886)', flag: '🇹🇼' },
  
  // ========== MIDDLE EAST ==========
  { value: '+973', label: '🇧🇭 Bahrain (+973)', flag: '🇧🇭' },
  { value: '+20', label: '🇪🇬 Egypt (+20)', flag: '🇪🇬' },
  { value: '+98', label: '🇮🇷 Iran (+98)', flag: '🇮🇷' },
  { value: '+964', label: '🇮🇶 Iraq (+964)', flag: '🇮🇶' },
  { value: '+972', label: '🇮🇱 Israel (+972)', flag: '🇮🇱' },
  { value: '+962', label: '🇯🇴 Jordan (+962)', flag: '🇯🇴' },
  { value: '+965', label: '🇰🇼 Kuwait (+965)', flag: '🇰🇼' },
  { value: '+961', label: '🇱🇧 Lebanon (+961)', flag: '🇱🇧' },
  { value: '+968', label: '🇴🇲 Oman (+968)', flag: '🇴🇲' },
  { value: '+974', label: '🇶🇦 Qatar (+974)', flag: '🇶🇦' },
  { value: '+966', label: '🇸🇦 Saudi Arabia (+966)', flag: '🇸🇦' },
  { value: '+971', label: '🇦🇪 UAE (+971)', flag: '🇦🇪' },
  
  // ========== EUROPE ==========
  { value: '+43', label: '🇦🇹 Austria (+43)', flag: '🇦🇹' },
  { value: '+32', label: '🇧🇪 Belgium (+32)', flag: '🇧🇪' },
  { value: '+359', label: '🇧🇬 Bulgaria (+359)', flag: '🇧🇬' },
  { value: '+385', label: '🇭🇷 Croatia (+385)', flag: '🇭🇷' },
  { value: '+357', label: '🇨🇾 Cyprus (+357)', flag: '🇨🇾' },
  { value: '+420', label: '🇨🇿 Czech Republic (+420)', flag: '🇨🇿' },
  { value: '+45', label: '🇩🇰 Denmark (+45)', flag: '🇩🇰' },
  { value: '+372', label: '🇪🇪 Estonia (+372)', flag: '🇪🇪' },
  { value: '+358', label: '🇫🇮 Finland (+358)', flag: '🇫🇮' },
  { value: '+33', label: '🇫🇷 France (+33)', flag: '🇫🇷' },
  { value: '+49', label: '🇩🇪 Germany (+49)', flag: '🇩🇪' },
  { value: '+30', label: '🇬🇷 Greece (+30)', flag: '🇬🇷' },
  { value: '+36', label: '🇭🇺 Hungary (+36)', flag: '🇭🇺' },
  { value: '+354', label: '🇮🇸 Iceland (+354)', flag: '🇮🇸' },
  { value: '+353', label: '🇮🇪 Ireland (+353)', flag: '🇮🇪' },
  { value: '+39', label: '🇮🇹 Italy (+39)', flag: '🇮🇹' },
  { value: '+371', label: '🇱🇻 Latvia (+371)', flag: '🇱🇻' },
  { value: '+370', label: '🇱🇹 Lithuania (+370)', flag: '🇱🇹' },
  { value: '+352', label: '🇱🇺 Luxembourg (+352)', flag: '🇱🇺' },
  { value: '+356', label: '🇲🇹 Malta (+356)', flag: '🇲🇹' },
  { value: '+31', label: '🇳🇱 Netherlands (+31)', flag: '🇳🇱' },
  { value: '+47', label: '🇳🇴 Norway (+47)', flag: '🇳🇴' },
  { value: '+48', label: '🇵🇱 Poland (+48)', flag: '🇵🇱' },
  { value: '+351', label: '🇵🇹 Portugal (+351)', flag: '🇵🇹' },
  { value: '+40', label: '🇷🇴 Romania (+40)', flag: '🇷🇴' },
  { value: '+7', label: '🇷🇺 Russia (+7)', flag: '🇷🇺' },
  { value: '+381', label: '🇷🇸 Serbia (+381)', flag: '🇷🇸' },
  { value: '+421', label: '🇸🇰 Slovakia (+421)', flag: '🇸🇰' },
  { value: '+386', label: '🇸🇮 Slovenia (+386)', flag: '🇸🇮' },
  { value: '+34', label: '🇪🇸 Spain (+34)', flag: '🇪🇸' },
  { value: '+46', label: '🇸🇪 Sweden (+46)', flag: '🇸🇪' },
  { value: '+41', label: '🇨🇭 Switzerland (+41)', flag: '🇨🇭' },
  { value: '+90', label: '🇹🇷 Turkey (+90)', flag: '🇹🇷' },
  { value: '+380', label: '🇺🇦 Ukraine (+380)', flag: '🇺🇦' },
  { value: '+44', label: '🇬🇧 United Kingdom (+44)', flag: '🇬🇧' },
  
  // ========== NORTH AMERICA ==========
  { value: '+1', label: '🇨🇦 Canada (+1)', flag: '🇨🇦' },
  { value: '+52', label: '🇲🇽 Mexico (+52)', flag: '🇲🇽' },
  { value: '+1', label: '🇺🇸 United States (+1)', flag: '🇺🇸' },
  
  // ========== SOUTH AMERICA ==========
  { value: '+54', label: '🇦🇷 Argentina (+54)', flag: '🇦🇷' },
  { value: '+55', label: '🇧🇷 Brazil (+55)', flag: '🇧🇷' },
  { value: '+56', label: '🇨🇱 Chile (+56)', flag: '🇨🇱' },
  { value: '+57', label: '🇨🇴 Colombia (+57)', flag: '🇨🇴' },
  { value: '+593', label: '🇪🇨 Ecuador (+593)', flag: '🇪🇨' },
  { value: '+51', label: '🇵🇪 Peru (+51)', flag: '🇵🇪' },
  { value: '+58', label: '🇻🇪 Venezuela (+58)', flag: '🇻🇪' },
  
  // ========== AFRICA ==========
  { value: '+213', label: '🇩🇿 Algeria (+213)', flag: '🇩🇿' },
  { value: '+251', label: '🇪🇹 Ethiopia (+251)', flag: '🇪🇹' },
  { value: '+233', label: '🇬🇭 Ghana (+233)', flag: '🇬🇭' },
  { value: '+254', label: '🇰🇪 Kenya (+254)', flag: '🇰🇪' },
  { value: '+212', label: '🇲🇦 Morocco (+212)', flag: '🇲🇦' },
  { value: '+234', label: '🇳🇬 Nigeria (+234)', flag: '🇳🇬' },
  { value: '+27', label: '🇿🇦 South Africa (+27)', flag: '🇿🇦' },
  { value: '+255', label: '🇹🇿 Tanzania (+255)', flag: '🇹🇿' },
  { value: '+256', label: '🇺🇬 Uganda (+256)', flag: '🇺🇬' },
];

/**
 * Helper function to get country code object by value
 */
export const getCountryCodeByValue = (value: string): CountryCode | undefined => {
  return countryCodes.find(code => code.value === value);
};

/**
 * Helper function to get default country code (Singapore)
 */
export const getDefaultCountryCode = (): CountryCode => {
  return countryCodes[0]; // Singapore
};
