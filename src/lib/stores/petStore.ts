// src/lib/stores/petStore.ts
import { writable, derived, get } from 'svelte/store';
import { petService } from '$lib/services/petService';
import type { Pet, PetWithRelations } from './index';

// Create writable stores
const pets = writable<Pet[]>([]);
const currentPet = writable<PetWithRelations | null>(null);
const isLoading = writable(false);
const error = writable<string | null>(null);

// Create derived stores
const hasPets = derived(pets, $pets => $pets.length > 0);

// Store actions
async function loadUserPets() {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await petService.getUserPets();
    
    if (response.error) {
      error.set(response.error.message);
      return;
    }
    
    pets.set(response.data || []);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    isLoading.set(false);
  }
}

async function loadPetDetails(id: string) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await petService.getPetById(id, true);
    
    if (response.error) {
      error.set(response.error.message);
      return;
    }
    
    currentPet.set(response.data || null);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    isLoading.set(false);
  }
}

async function createPet(petData: any) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await petService.createPet(petData);
    
    if (response.error) {
      error.set(response.error.message);
      return null;
    }
    
    // Reload pets list to include the new pet
    await loadUserPets();
    return response.data;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'An unknown error occurred');
    return null;
  } finally {
    isLoading.set(false);
  }
}

async function updatePet(id: string, petData: any) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await petService.updatePet(id, petData);
    
    if (response.error) {
      error.set(response.error.message);
      return null;
    }
    
    // Update the pet in the list
    const currentPets = get(pets);
    pets.set(currentPets.map(pet => pet.id === id ? { ...pet, ...response.data } : pet));
    
    // Update currentPet if it's the one being edited
    const current = get(currentPet);
    if (current && current.id === id) {
      currentPet.set({ ...current, ...response.data });
    }
    
    return response.data;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'An unknown error occurred');
    return null;
  } finally {
    isLoading.set(false);
  }
}

async function deletePet(id: string) {
  isLoading.set(true);
  error.set(null);
  
  try {
    const response = await petService.deletePet(id);
    
    if (response.error) {
      error.set(response.error.message);
      return false;
    }
    
    // Remove the pet from the list
    const currentPets = get(pets);
    pets.set(currentPets.filter(pet => pet.id !== id));
    
    // Clear currentPet if it's the one being deleted
    const current = get(currentPet);
    if (current && current.id === id) {
      currentPet.set(null);
    }
    
    return true;
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'An unknown error occurred');
    return false;
  } finally {
    isLoading.set(false);
  }
}

function getPetById(id: string) {
  return get(pets).find(pet => pet.id === id) || null;
}

// Export the stores and actions
export const petStore = {
  // Expose the store objects directly
  pets,
  currentPet,
  isLoading,
  error,
  hasPets,
  
  // Actions
  loadUserPets,
  loadPetDetails,
  createPet,
  updatePet,
  deletePet,
  getPetById
};