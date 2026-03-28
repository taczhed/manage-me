import { User } from './types';

export const currentUser: User = { id: '1', firstName: 'Patryk', lastName: 'Lach', role: 'admin' };

export const users: User[] = [
  currentUser,
  { id: '2', firstName: 'Anna', lastName: 'Kowalska', role: 'developer' },
  { id: '3', firstName: 'Marek', lastName: 'Wiśniewski', role: 'developer' },
  { id: '4', firstName: 'Tomasz', lastName: 'Nowak', role: 'devops' },
];
