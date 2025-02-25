import { qrService } from '$lib/services/qrService';

// QR code type definition
interface QRCode {
  id: string;
  code: string;
  pet_id?: string;
  is_active: boolean;
  created_at: string;
  linked_at?: string;
}

// State
let qrCodes = $state<QRCode[]>([]);
let currentQRCode = $state<QRCode | null>(null);
let isLoading = $state(false);
let error = $state<string | null>(null);

// Actions
async function loadUserQRCodes() {
  isLoading = true;
  error = null;
  
  try {
    const response = await qrService.getUserQRCodes();
    
    if (response.error) {
      error = response.error.message;
      return;
    }
    
    qrCodes = response.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  } finally {
    isLoading = false;
  }
}

async function getQRByCode(code: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await qrService.getQRByCode(code);
    
    if (response.error) {
      error = response.error.message;
      return null;
    }
    
    currentQRCode = response.data || null;
    return currentQRCode;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return null;
  } finally {
    isLoading = false;
  }
}

async function getQRCodesForPet(petId: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await qrService.getQRCodesForPet(petId);
    
    if (response.error) {
      error = response.error.message;
      return [];
    }
    
    return response.data || [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return [];
  } finally {
    isLoading = false;
  }
}

async function linkQRCodeToPet(code: string, petId: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await qrService.linkQRCodeToPet(code, petId);
    
    if (response.error) {
      error = response.error.message;
      return false;
    }
    
    // Update the QR code in the list
    qrCodes = qrCodes.map(qr => 
      qr.code === code ? { ...qr, pet_id: petId, linked_at: new Date().toISOString() } : qr
    );
    
    // Update currentQRCode if it's the one being linked
    if (currentQRCode && currentQRCode.code === code) {
      currentQRCode = { ...currentQRCode, pet_id: petId, linked_at: new Date().toISOString() };
    }
    
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

async function unlinkQRCode(code: string) {
  isLoading = true;
  error = null;
  
  try {
    const response = await qrService.unlinkQRCode(code);
    
    if (response.error) {
      error = response.error.message;
      return false;
    }
    
    // Update the QR code in the list
    qrCodes = qrCodes.map(qr => 
      qr.code === code ? { ...qr, pet_id: undefined, linked_at: undefined } : qr
    );
    
    // Update currentQRCode if it's the one being unlinked
    if (currentQRCode && currentQRCode.code === code) {
      currentQRCode = { ...currentQRCode, pet_id: undefined, linked_at: undefined };
    }
    
    return true;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
    return false;
  } finally {
    isLoading = false;
  }
}

// Generate QR code URLs
function getPetQRCodeURL(petId: string) {
  return `${window.location.origin}/p/${petId}`;
}

function getQRCodeRedirectURL(code: string) {
  return `${window.location.origin}/qr/${code}`;
}

// Derived state
function getLinkedPets() {
  return qrCodes
    .filter(qr => qr.pet_id)
    .reduce((acc, qr) => {
      if (qr.pet_id && !acc.includes(qr.pet_id)) {
        acc.push(qr.pet_id);
      }
      return acc;
    }, [] as string[]);
}

// Export the store
export const qrStore = {
  // State
  get qrCodes() { return qrCodes; },
  get currentQRCode() { return currentQRCode; },
  get isLoading() { return isLoading; },
  get error() { return error; },
  
  // Actions
  loadUserQRCodes,
  getQRByCode,
  getQRCodesForPet,
  linkQRCodeToPet,
  unlinkQRCode,
  getPetQRCodeURL,
  getQRCodeRedirectURL,
  
  // Derived state
  get linkedQRCodes() { return qrCodes.filter(qr => qr.pet_id); },
  get unlinkedQRCodes() { return qrCodes.filter(qr => !qr.pet_id); },
  getLinkedPets
};