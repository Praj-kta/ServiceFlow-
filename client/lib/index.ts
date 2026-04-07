// // write api i just want call that function 

import { api } from "./api";
import { DashboardStats, UserProfile, UserProfile } from "./type";

export const userDashboardStats = (userId: string) => {
  return api.get<DashboardStats>(`/user/dashboard/${userId}`);
}

export const userTransactionsApi = (userId: string) => {
  return api.get<any[]>(`/user/transactions/${userId}`);
};

export const userFavoritesApi = (userId: string) => {
  return api.get<any[]>(`/user/favorites/${userId}`);
}

export const userProfileApi = (userId: string) => {
  return api.get<UserProfile>(`/user/profile/${userId}`);
}

export const userBookingsApi = (userId: string) => {
  return api.get<any[]>(`/bookings/user/${userId}`);
}

export const userApi = async () => {
  return api.get<UserProfile>(`/user/me`);
}