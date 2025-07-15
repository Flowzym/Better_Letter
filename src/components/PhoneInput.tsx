import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
}

const COUNTRY_CODES = [
  { code: '+43', country: 'Österreich', flag: '🇦🇹' },
  { code: '+49', country: 'Deutschland', flag: '🇩🇪' },
  { code: '+41', country: 'Schweiz', flag: '🇨🇭' },
  { code: '+1', country: 'USA/Kanada', flag: '🇺🇸' },
  { code: '+44', country: 'Vereinigtes Königreich', flag: '🇬🇧' },
  { code: '+33', country: 'Frankreich', flag: '🇫🇷' },
  { code: '+39', country: 'Italien', flag: '🇮🇹' },
  { code: '+34', country: 'Spanien', flag: '🇪🇸' },
  { code: '+31', country: 'Niederlande', flag: '🇳🇱' },
  { code: '+32', country: 'Belgien', flag: '🇧🇪' },
  { code: '+45', country: 'Dänemark', flag: '🇩🇰' },
  { code: '+46', country: 'Schweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norwegen', flag: '🇳🇴' },
  { code: '+358', country: 'Finnland', flag: '🇫🇮' },
  { code: '+48', country: 'Polen', flag: '🇵🇱' },
  { code: '+420', country: 'Tschechien', flag: '🇨🇿' },
  { code: '+421', country: 'Slowakei', flag: '🇸🇰' },
  { code: '+36', country: 'Ungarn', flag: '🇭🇺' },
  { code: '+385', country: 'Kroatien', flag: '🇭🇷' },
  { code: '+386', country: 'Slowenien', flag: '🇸🇮' },
];

export default function PhoneInput({ countryCode, phoneNumber, onCountryChange, onPhoneChange }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set default country code if empty
  useEffect(() => {
    if (!countryCode) {
      onCountryChange('+43'); // Default to Austria
    }
  }, [countryCode, onCountryChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCodes = COUNTRY_CODES.filter(item => 
    item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.includes(searchTerm)
  );

  const selectedCountry = COUNTRY_CODES.find(item => item.code === countryCode);

  const handleCountrySelect = (code: string) => {
    onCountryChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format based on Austrian phone number patterns
    if (countryCode === '+43') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
    
    // Generic formatting for other countries
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onPhoneChange(formatted);
  };

  return (
    <div className="flex space-x-2">
      {/* Country Code Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 h-10 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500 min-w-[120px]"
        >
          <span className="text-lg">{selectedCountry?.flag || '🌍'}</span>
          <span className="text-sm font-medium">{countryCode || '+43'}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[280px]">
            {/* Search */}
            <div className="p-2 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Land suchen..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                autoFocus
              />
            </div>

            {/* Country List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCodes.map(item => (
                <button
                  key={item.code}
                  onClick={() => handleCountrySelect(item.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                    countryCode === item.code ? 'text-white' : 'text-gray-900'
                  }`}
                  style={countryCode === item.code ? { backgroundColor: '#F29400' } : {}}
                >
                  <span className="text-lg">{item.flag}</span>
                  <span className="font-medium">{item.code}</span>
                  <span className="flex-1">{item.country}</span>
                </button>
              ))}
              {filteredCodes.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Kein Land gefunden
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <div className="relative flex-1">
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
        className="w-full h-10 pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="123 456 7890"
        />
      </div>
    </div>
  );
}