
export interface DashboardStats {
  totalBookings: number;
  amountSpent: number;
  favorites: number;
  completedServices: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
}
