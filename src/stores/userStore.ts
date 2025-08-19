import { create } from 'zustand';

export interface ApiUser {
  id: string;
  createdAt: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  lastActiveDate: string;
  profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar: string;
    gender: string;
    bvn: string;
    address: string;
    currency: string;
  };
  guarantor: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    address: string;
  };
  accountBalance: string;
  accountNumber: string;
}

interface UserState {
  users: ApiUser[];
  filteredUsers: ApiUser[];
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  sortField: keyof ApiUser | null;
  sortDirection: 'asc' | 'desc';
  statusFilter: string;
  orgFilter: string;
  
  // Actions
  fetchUsers: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (field: keyof ApiUser, direction: 'asc' | 'desc') => void;
  setStatusFilter: (status: string) => void;
  setOrgFilter: (org: string) => void;
  applyFilters: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  filteredUsers: [],
  loading: false,
  searchQuery: '',
  currentPage: 1,
  pageSize: 10,
  sortField: null,
  sortDirection: 'asc',
  statusFilter: '',
  orgFilter: '',

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch('https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users');
      const users = await response.json();
      set({ users, filteredUsers: users, loading: false });
      get().applyFilters();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({ loading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFilters();
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
  },

  setSorting: (field: keyof ApiUser, direction: 'asc' | 'desc') => {
    set({ sortField: field, sortDirection: direction });
    get().applyFilters();
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, currentPage: 1 });
    get().applyFilters();
  },

  setOrgFilter: (org: string) => {
    set({ orgFilter: org, currentPage: 1 });
    get().applyFilters();
  },

  applyFilters: () => {
    const { users, searchQuery, sortField, sortDirection, statusFilter, orgFilter } = get();
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.userName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.profile.firstName.toLowerCase().includes(query) ||
        user.profile.lastName.toLowerCase().includes(query) ||
        user.orgName.toLowerCase().includes(query) ||
        user.phoneNumber.includes(query)
      );
    }

    // Apply organization filter
    if (orgFilter) {
      filtered = filtered.filter(user => user.orgName === orgFilter);
    }

    // Apply status filter (simulated based on lastActiveDate)
    if (statusFilter) {
      filtered = filtered.filter(user => {
        const lastActive = new Date(user.lastActiveDate);
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (statusFilter) {
          case 'active':
            return daysSinceActive <= 7;
          case 'inactive':
            return daysSinceActive > 30;
          case 'pending':
            return daysSinceActive > 7 && daysSinceActive <= 30;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        // Handle nested properties
        if (sortField === 'profile') {
          aValue = `${a.profile.firstName} ${a.profile.lastName}`;
          bValue = `${b.profile.firstName} ${b.profile.lastName}`;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    set({ filteredUsers: filtered });
  },
}));