import { writable, derived, get } from 'svelte/store';
import { petService } from '$lib/services/petService';
import type { Pet, PetWithRelations } from './index';
import type { Database } from '../../DatabaseDefinitions';

// Create store for pets
const createPetStore = () => {
  const pets = writable<Pet[]>([]);
  const currentPet = writable<PetWithRelations | null>(null);
  const isLoading = writable(false);
  const error = writable<string | null>(null);

  // Derived store for whether the user has pets
  const hasPets = derived(pets, $pets => $pets.length > 0);

  // Load user's pets
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

  // Load a specific pet's details
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

  // Create a new pet
  async function createPet(petData: Database['public']['Tables']['pets']['Insert']) {
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

  // Update an existing pet
  async function updatePet(id: string, petData: Database['public']['Tables']['pets']['Update']) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await petService.updatePet(id, petData);
      
      if (response.error) {
        error.set(response.error.message);
        return null;
      }
      
      // Update the pet in the list
      const updatedPets = get(pets).map(pet => pet.id === id ? { ...pet, ...response.data } : pet);
      pets.set(updatedPets);
      
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

  // Delete a pet
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
      const updatedPets = get(pets).filter(pet => pet.id !== id);
      pets.set(updatedPets);
      
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

  // Get pet by ID
  function getPetById(id: string) {
    return get(pets).find(pet => pet.id === id) || null;
  }

  return {
    // State
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
};

export const petStore = createPetStore();