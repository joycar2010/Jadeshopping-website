export type SupportedCountry = 'United States' | 'Canada' | 'United Kingdom' | 'China' | 'Australia';

export interface CountryLocation {
  dialCode: string; // e.g. 'US +1'
  provinces: Record<string, string[]>; // province/state -> cities
}

export const locations: Record<SupportedCountry, CountryLocation> = {
  'United States': {
    dialCode: 'US +1',
    provinces: {
      California: ['Los Angeles', 'San Francisco', 'San Diego'],
      NewYork: ['New York', 'Buffalo', 'Rochester'],
      Texas: ['Houston', 'Dallas', 'Austin']
    }
  },
  Canada: {
    dialCode: 'CA +1',
    provinces: {
      Ontario: ['Toronto', 'Ottawa', 'Hamilton'],
      Quebec: ['Montreal', 'Quebec City'],
      BritishColumbia: ['Vancouver', 'Victoria']
    }
  },
  'United Kingdom': {
    dialCode: 'UK +44',
    provinces: {
      England: ['London', 'Manchester', 'Birmingham'],
      Scotland: ['Edinburgh', 'Glasgow'],
      Wales: ['Cardiff', 'Swansea']
    }
  },
  China: {
    dialCode: 'CN +86',
    provinces: {
      北京市: ['北京市'],
      上海市: ['上海市'],
      广东省: ['广州', '深圳', '佛山'],
      浙江省: ['杭州', '宁波']
    }
  },
  Australia: {
    dialCode: 'AU +61',
    provinces: {
      'New South Wales': ['Sydney', 'Newcastle'],
      Victoria: ['Melbourne', 'Geelong'],
      Queensland: ['Brisbane', 'Gold Coast']
    }
  }
};

export function getProvincesByCountry(country: string): string[] {
  const data = locations[country as SupportedCountry];
  return data ? Object.keys(data.provinces) : [];
}

export function getCitiesByCountryProvince(country: string, province: string): string[] {
  const data = locations[country as SupportedCountry];
  if (!data) return [];
  const cities = data.provinces[province];
  return cities || [];
}

export function getDialCode(country: string): string {
  const data = locations[country as SupportedCountry];
  return data ? data.dialCode : 'US +1';
}