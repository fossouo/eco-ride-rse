export interface BaseProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProfile extends BaseProfile {
  type: 'client';
  favoriteAddresses: Address[];
  paymentMethods: PaymentMethod[];
  rating: number;
  totalRides: number;
}

export interface DriverProfile extends BaseProfile {
  type: 'driver';
  vehicle: Vehicle;
  license: License;
  insurance: Insurance;
  bankAccount: BankAccount;
  rating: number;
  totalRides: number;
  isAvailable: boolean;
  currentLocation?: Location;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home' | 'work' | 'other';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'other';
  lastFourDigits?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  type: 'standard' | 'eco' | 'premium';
  documents: Document[];
}

export interface License {
  number: string;
  expiryDate: Date;
  imageUrl: string;
  verified: boolean;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  expiryDate: Date;
  imageUrl: string;
  verified: boolean;
}

export interface BankAccount {
  id: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  verified: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  heading?: number;
  timestamp: Date;
}