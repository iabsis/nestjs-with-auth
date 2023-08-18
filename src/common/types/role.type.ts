// List of role accepted for users
export type Role = 'admin' | 'user';

// Roles useable for authentication stuff, "ANY" means any role has access
export type RoleExtended = Role | 'ANY';
