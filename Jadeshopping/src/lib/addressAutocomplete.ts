import { locations, SupportedCountry } from '../data/locations';

export interface AddressSuggestion {
  label: string; // display string
  addressLine1: string;
  city: string;
  province: string;
  zipCode?: string;
}

// Simple local provider that builds suggestions from our location dataset.
// This function is designed to be replaced with a real API provider later.
export async function suggestAddresses(query: string, country: string): Promise<AddressSuggestion[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const data = locations[country as SupportedCountry];
  if (!data) return [];

  const results: AddressSuggestion[] = [];
  const sampleStreets = ['Main St', 'Broadway', 'Market St', 'Central Ave'];

  Object.entries(data.provinces).forEach(([province, cities]) => {
    cities.forEach((city) => {
      sampleStreets.forEach((street, idx) => {
        const label = `${idx + 10} ${street}, ${city}, ${province}`;
        if (label.toLowerCase().includes(q)) {
          results.push({
            label,
            addressLine1: `${idx + 10} ${street}`,
            city,
            province,
            zipCode: undefined
          });
        }
      });
    });
  });

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 150));
  // Limit results
  return results.slice(0, 8);
}