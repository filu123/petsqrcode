import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { petStore } from './petStore';

// Create store for selected pet
const createSelectedPetStore = () => {
  // Initialize from localStorage if available
  const initialPetId = browser 
    ? localStorage.getItem('selectedPetId') 
    : null;
  
  const selectedPetId = writable<string | null>(initialPetId);
  const isNavigating = writable(false);

  // Save to localStorage when selectedPetId changes
  if (browser) {
    selectedPetId.subscribe(value => {
      if (value) {
        localStorage.setItem('selectedPetId', value);
      } else {
        localStorage.removeItem('selectedPetId');
      }
    });
  }

  // Derive the selected pet object from the selected ID
  const selectedPet = derived(
    [selectedPetId, petStore.pets], 
    ([$selectedPetId, $pets]) => {
      return $selectedPetId 
        ? $pets.find(pet => pet.id === $selectedPetId) || null
        : null;
    }
  );

  // Select a pet and optionally navigate to its page
  async function selectPet(petId: string, navigate: boolean = false) {
    selectedPetId.set(petId);
    
    if (navigate) {
      isNavigating.set(true);
      try {
        await goto(`/dashboard/pets/${petId}`);
      } finally {
        isNavigating.set(false);
      }
    }
  }

  // Clear selection
  function clearSelection() {
    selectedPetId.set(null);
    if (browser) {
      localStorage.removeItem('selectedPetId');
    }
  }

  // Select first pet if none selected and pets are available
  function selectFirstPetIfNoneSelected() {
    const currentPets = get(petStore.pets);
    const currentSelectedPetId = get(selectedPetId);
    
    if (!currentSelectedPetId && currentPets.length > 0) {
      selectPet(currentPets[0].id);
    }
  }

  return {
    // State
    selectedPetId,
    selectedPet,
    isNavigating,
    
    // Actions
    selectPet,
    clearSelection,
    selectFirstPetIfNoneSelected
  };
};

export const selectedPetStore = createSelectedPetStore();