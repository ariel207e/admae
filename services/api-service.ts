import { MOCK_USERS, MOCK_DOCUMENTS, MOCK_NOTIFICATIONS } from './fake-data';

// Simula delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Usuarios
  async getUsers() {
    await delay(800);
    return MOCK_USERS;
  },

  async getUser(id: string) {
    await delay(500);
    return MOCK_USERS.find((u) => u.id === id);
  },

  // Documentos
  async getDocuments() {
    await delay(800);
    return MOCK_DOCUMENTS;
  },

  async getDocument(id: string) {
    await delay(500);
    return MOCK_DOCUMENTS.find((d) => d.id === id);
  },

  // Notificaciones
  async getNotifications() {
    await delay(600);
    return MOCK_NOTIFICATIONS;
  },

  async markNotificationAsRead(id: string) {
    await delay(300);
    const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (notification) {
      notification.leido = true;
    }
    return notification;
  },
};
