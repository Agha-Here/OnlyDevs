import { seedSampleData } from '../lib/supabase';

// Initialize sample data when the app loads
export const initializeSampleData = async () => {
  try {
    await seedSampleData();
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
  }
};