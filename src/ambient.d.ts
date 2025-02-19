declare global {
  type FormAccountUpdateResult = {
    errorMessage?: string
    errorFields?: string[]
    firstName?: string
    lastName?: string
    homePhone?: string
    mobilePhone?: string
    email?: string
    country?: string
    address?: string
    petName?: string
    petSecondName?: string
    dateOfBirth?: string
    gender?: string
    petType?: string
    temperament?: string
    food?: string
    favouriteTreats?: string
    allergies?: string
    breed?: string
    bio?: string
    petAvatarUrl?: string
  }
}

export {FormAccountUpdateResult}
