export type Role = "OWNER" | "ADMIN" | "EMPLOYEE";

export interface Staff {
  id?: string | number;
  fullName?: string;
  email?: string;
  role?: Role;
  Role?: Role;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  staff: Staff;
}

export type MeResponse = Staff | { staff: Staff };
