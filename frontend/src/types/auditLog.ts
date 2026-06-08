export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_REGISTER'
  | 'USER_CREATED_SERVICE'
  | 'USER_UPDATED_SERVICE'
  | 'USER_DELETED_SERVICE'
  | 'USER_TRIGGERED_CHECK'
  | 'USER_ENABLED_AUTOCHECK'
  | 'USER_DISABLED_AUTOCHECK';

export interface AuditUser {
  id:    number;
  name:  string;
  email: string;
}

export interface AuditLog {
  id:          number;
  user?:       AuditUser;
  action:      AuditAction;
  entityType:  string;
  entityId:    number | null;
  description: string;
  createdAt:   string;
}
