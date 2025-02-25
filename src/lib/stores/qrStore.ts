import { writable, derived, get } from 'svelte/store';
import { qrService } from '$lib/services/qrService';
import type { QRCode } from './index';

// Create store for QR codes
const createQRStore = () => {
  const qrCodes = writable<QRCode[]>([]);
  const currentQRCode = writable<QRCode | null>(null);
  const isLoading = writable(false);
  const error = writable<string | null>(null);

  // Derived stores
  const linkedQRCodes = derived(qrCodes, $qrCodes => 
    $qrCodes.filter(qr => qr.pet_id)
  );
  
  const unlinkedQRCodes = derived(qrCodes, $qrCodes => 
    $qrCodes.filter(qr => !qr.pet_id)
  );

  // Load user's QR codes
  async function loadUserQRCodes() {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await qrService.getUserQRCodes();
      
      if (response.error) {
        error.set(response.error.message);
        return;
      }
      
      qrCodes.set(response.data || []);
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      isLoading.set(false);
    }
  }

  // Get a QR code by code
  async function getQRByCode(code: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await qrService.getQRByCode(code);
      
      if (response.error) {
        error.set(response.error.message);
        return null;
      }
      
      currentQRCode.set(response.data || null);
      return response.data;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      isLoading.set(false);
    }
  }

  // Get QR codes for a pet
  async function getQRCodesForPet(petId: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await qrService.getQRCodesForPet(petId);
      
      if (response.error) {
        error.set(response.error.message);
        return [];
      }
      
      return response.data || [];
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return [];
    } finally {
      isLoading.set(false);
    }
  }

  // Link a QR code to a pet
  async function linkQRCodeToPet(code: string, petId: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await qrService.linkQRCodeToPet(code, petId);
      
      if (response.error) {
        error.set(response.error.message);
        return false;
      }
      
      // Update the QR code in the list
      const updatedCodes = get(qrCodes).map(qr => 
        qr.code === code ? { ...qr, pet_id: petId, linked_at: new Date().toISOString() } : qr
      );
      qrCodes.set(updatedCodes);
      
      // Update currentQRCode if it's the one being linked
      const current = get(currentQRCode);
      if (current && current.code === code) {
        currentQRCode.set({ ...current, pet_id: petId, linked_at: new Date().toISOString() });
      }
      
      return true;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      isLoading.set(false);
    }
  }

  // Unlink a QR code
  async function unlinkQRCode(code: string) {
    isLoading.set(true);
    error.set(null);
    
    try {
      const response = await qrService.unlinkQRCode(code);
      
      if (response.error) {
        error.set(response.error.message);
        return false;
      }
      
      // Update the QR code in the list
      const updatedCodes = get(qrCodes).map(qr => 
        qr.code === code ? { ...qr, pet_id: undefined, linked_at: undefined } : qr
      );
      qrCodes.set(updatedCodes);
      
      // Update currentQRCode if it's the one being unlinked
      const current = get(currentQRCode);
      if (current && current.code === code) {
        currentQRCode.set({ ...current, pet_id: undefined, linked_at: undefined });
      }
      
      return true;
    } catch (err) {
      error.set(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      isLoading.set(false);
    }
  }

  // Get linked pet IDs
  function getLinkedPets() {
    return get(qrCodes)
      .filter(qr => qr.pet_id)
      .reduce((acc, qr) => {
        if (qr.pet_id && !acc.includes(qr.pet_id)) {
          acc.push(qr.pet_id);
        }
        return acc;
      }, [] as string[]);
  }

  // Generate QR code URLs
  function getPetQRCodeURL(petId: string) {
    return `${window.location.origin}/p/${petId}`;
  }

  function getQRCodeRedirectURL(code: string) {
    return `${window.location.origin}/qr/${code}`;
  }

  return {
    // State
    qrCodes,
    currentQRCode,
    isLoading,
    error,
    linkedQRCodes,
    unlinkedQRCodes,
    
    // Actions
    loadUserQRCodes,
    getQRByCode,
    getQRCodesForPet,
    linkQRCodeToPet,
    unlinkQRCode,
    getLinkedPets,
    getPetQRCodeURL,
    getQRCodeRedirectURL
  };
};

export const qrStore = createQRStore();