import Geolocation from '@react-native-community/geolocation';
import { Location } from '../types/profile';

class LocationService {
  private watchId: number | null = null;

  // Obtenir la position actuelle
  getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading || undefined,
            timestamp: new Date(position.timestamp),
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }

  // Suivre la position en temps réel
  watchPosition(callback: (location: Location) => void): void {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading || undefined,
          timestamp: new Date(position.timestamp),
        });
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 },
    );
  }

  // Arrêter le suivi de position
  stopWatching(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculer la distance entre deux points
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convertir en radians
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  // Vérifier si le chauffeur est proche du client
  isNearby(
    driverLocation: Location,
    clientLocation: Location,
    maxDistance: number = 0.5,
  ): boolean {
    const distance = this.calculateDistance(
      driverLocation.latitude,
      driverLocation.longitude,
      clientLocation.latitude,
      clientLocation.longitude,
    );
    return distance <= maxDistance;
  }

  // Obtenir l'adresse à partir des coordonnées (Geocoding inverse)
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await response.json();
      return data.display_name || 'Adresse inconnue';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Adresse inconnue';
    }
  }
}

export default new LocationService();