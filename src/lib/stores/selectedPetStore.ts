import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { petStore } from './petStore';
import type { Database } from '../../DatabaseDefinitions';

type Pet = Database['public']['Tables']['pets']['Row'];

// State
let selectedPetId = $state<string | null>(null);
let isNavigating = $state(false);

// Initialize from localStorage if available
if (browser) {
  const savedPetId = localStorage.getItem('selectedPetId');
  if (savedPetId) {
    selectedPetId = savedPetId;
  }
}

// Save to localStorage when selectedPetId changes
$effect(() => {
  if (browser && selectedPetId) {
    localStorage.setItem('selectedPetId', selectedPetId);
  }
});

// Derived state
let selectedPet = $derived(() => {
  return selectedPetId ? petStore.getPetById(selectedPetId) : null;
});

// Select a pet and optionally navigate to its page
async function selectPet(petId: string, navigate: boolean = false) {
  selectedPetId = petId;
  
  if (navigate) {
    isNavigating = true;
    try {
      await goto(`/dashboard/pets/${petId}`);
    } finally {
      isNavigating = false;
    }
  }
}

// Clear selection
function clearSelection() {
  selectedPetId = null;
  if (browser) {
    localStorage.removeItem('selectedPetId');
  }
}

// Select first pet if none selected and pets are available
function selectFirstPetIfNoneSelected() {
  if (!selectedPetId && petStore.pets.length > 0) {
    selectPet(petStore.pets[0].id);
  }
}

// Export the store
export const selectedPetStore = {
  // State
  get selectedPetId() { return selectedPetId; },
  get selectedPet() { return selectedPet; },
  get isNavigating() { return isNavigating; },
  
  // Actions
  selectPet,
  clearSelection,
  selectFirstPetIfNoneSelected
};