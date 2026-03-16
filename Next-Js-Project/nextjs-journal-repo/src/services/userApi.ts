import { apiClient } from './apiClient';

export const getUsers = async () => {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { id: 1, name: 'John', email: 'john@test.com' },
      { id: 2, name: 'Jane', email: 'jane@test.com' }
    ]), 500)
  );
};
