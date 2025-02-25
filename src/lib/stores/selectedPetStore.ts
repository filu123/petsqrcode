// src/lib/stores/selectedPetStore.ts
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { petStore } from './petStore';

// Initialize from localStorage if available
const initialPetId = browser 
  ? localStorage.getItem('selectedPetId') 
  : null;

// Create writable stores
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

// Create derived store
const selectedPet = derived(
  [selectedPetId, petStore.pets], 
  ([$selectedPetId, $pets]) => {
    return $selectedPetId 
      ? $pets.find(pet => pet.id === $selectedPetId) || null
      : null;
  }
);

// Actions
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

function clearSelection() {
  selectedPetId.set(null);
  if (browser) {
    localStorage.removeItem('selectedPetId');
  }
}

function selectFirstPetIfNoneSelected() {
  const currentPets = get(petStore.pets);
  const currentSelectedPetId = get(selectedPetId);
  
  if (!currentSelectedPetId && currentPets.length > 0) {
    selectPet(currentPets[0].id);
  }
}

// Export the stores and actions
export const selectedPetStore = {
  // Expose the store objects directly
  selectedPetId,
  selectedPet,
  isNavigating,
  
  // Actions
  selectPet,
  clearSelection,
  selectFirstPetIfNoneSelected
};