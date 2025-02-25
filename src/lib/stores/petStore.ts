import { petService } from '$lib/services/petService';
import type { Database } from '../../DatabaseDefinitions';

type Pet = Database['public']['Tables']['pets']['Row'];
type PetWithRelations = Pet & {
  pet_contacts?: Database['public']['Tables']['pet_contacts']['Row'][];
  pet_maintenance?: Database['public']['Tables']['pet_maintenance']['Row'][];
  pet_veterinarian?: Database['public']['Tables']['pet_veterinarian']['Row'][];
};

// State
let pets = $state<Pet[]>([]);
let isLoading = $state(false);
let error = $state<string | null>(null);
let currentPet = $state<PetWithRelations | null>(null);

// Actions
async function loadUserPets() {
  isLoading = true;
  error = null;
  
  try {
    const response = await petService.getUserPets();
    
    if (response.error) {
      error = response.error.message;
      return;
    }
    
    pets = response.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading = false;
  }
}

async function loadPetDetails(id: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await petService.getPetById(id, true);
    
    if (response.error) {
      error = response.error.message;
      return;
    }
    
    currentPet = response.data || null;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading = false;
  }
}

async function createPet(petData: Database['public']['Tables']['pets']['Insert']) {
  isLoading = true;
  error = null;
  
  try {
    const response = await petService.createPet(petData);
    
    if (response.error) {
      error = response.error.message;
      return null;
    }
    
    // Reload pets list to include the new pet
    await loadUserPets();
    return response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return null;
  } finally {
    isLoading = false;
  }
}

async function updatePet(id: string, petData: Database['public']['Tables']['pets']['Update']) {
  isLoading = true;
  error = null;
  
  try {
    const response = await petService.updatePet(id, petData);
    
    if (response.error) {
      error = response.error.message;
      return null;
    }
    
    // Update the pet in the list
    pets = pets.map(pet => pet.id === id ? { ...pet, ...response.data } : pet);
    
    // Update currentPet if it's the one being edited
    if (currentPet && currentPet.id === id) {
      currentPet = { ...currentPet, ...response.data };
    }
    
    return response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return null;
  } finally {
    isLoading = false;
  }
}

async function deletePet(id: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await petService.deletePet(id);
    
    if (response.error) {
      error = response.error.message;
      return false;
    }
    
    // Remove the pet from the list
    pets = pets.filter(pet => pet.id !== id);
    
    // Clear currentPet if it's the one being deleted
    if (currentPet && currentPet.id === id) {
      currentPet = null;
    }
    
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

// Export the store
export const petStore = {
  // State
  get pets() { return pets; },
  get isLoading() { return isLoading; },
  get error() { return error; },
  get currentPet() { return currentPet; },
  
  // Actions
  loadUserPets,
  loadPetDetails,
  createPet,
  updatePet,
  deletePet,
  
  // Derived state
  get hasPets() { return pets.length > 0; },
  getPetById: (id: string) => pets.find(pet => pet.id === id) || null
};