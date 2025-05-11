// This is a simplified mock of what would be a native module for notification listening
// In a real implementation, you would use a native module like react-native-notification-listener

import EventEmitter from "events";

// Supported messaging apps
const SUPPORTED_APPS = [
  "com.whatsapp",
  "com.facebook.orca", // Messenger
  "com.tinder",
  "com.match.android.matchdating",
  "com.bumble.app",
  "kik.android",
  "com.snapchat.android",
  "com.instagram.android",
];

export interface NotificationData {
  packageName: string;
  title: string;
  text: string;
  timestamp: number;
  isChat: boolean;
}

class NotificationService extends EventEmitter {
  private isRunning: boolean = false;
  private permissionsGranted: boolean = false;

  constructor() {
    super();
    // In a real app, check if permissions are already granted
    this.checkPermissions();
  }

  // Simulate checking if we have permission to read notifications
  private async checkPermissions(): Promise<boolean> {
    // In a real app, this would check if the notification listener service is enabled
    // For now, we'll just return false and require explicit permission granting
    this.permissionsGranted = false;
    return this.permissionsGranted;
  }

  // Request permissions to listen to notifications
  public async requestPermissions(): Promise<boolean> {
    // In a real app, this would:
    // 1. Open system settings to enable notification access
    // 2. Check if permissions were granted

    // For demo purposes, simulate permission granting
    this.permissionsGranted = true;
    return this.permissionsGranted;
  }

  // Start listening for notifications
  public async startListening(): Promise<boolean> {
    if (!this.permissionsGranted) {
      console.warn("Notification permissions not granted");
      return false;
    }

    if (this.isRunning) {
      return true;
    }

    try {
      // In a real implementation, this would register a native notification listener
      console.log("Started notification listener service");

      this.isRunning = true;
      return true;
    } catch (error) {
      console.error("Failed to start notification listener", error);
      return false;
    }
  }

  // Stop listening for notifications
  public async stopListening(): Promise<boolean> {
    if (!this.isRunning) {
      return true;
    }

    try {
      // In a real implementation, this would unregister the native notification listener
      console.log("Stopped notification listener service");

      this.isRunning = false;
      return true;
    } catch (error) {
      console.error("Failed to stop notification listener", error);
      return false;
    }
  }

  // Check if the notification is from a supported chat app
  private isSupportedChatApp(packageName: string): boolean {
    return SUPPORTED_APPS.includes(packageName);
  }

  // Process a new notification
  public processNotification(data: NotificationData): void {
    // Filter only notifications from supported chat apps
    if (!this.isSupportedChatApp(data.packageName)) {
      return;
    }

    // Check if this is likely a chat message
    // In a real app, you'd have more sophisticated detection
    if (data.isChat) {
      this.emit("newChatMessage", data);
    }
  }

  // For testing purposes, simulate receiving a new notification
  public simulateNotification(
    packageName: string,
    title: string,
    text: string
  ): void {
    const mockNotification: NotificationData = {
      packageName,
      title,
      text,
      timestamp: Date.now(),
      isChat: true,
    };

    // Process as if it came from the system
    this.processNotification(mockNotification);
  }
}

// Export as singleton
export const notificationService = new NotificationService();
export default notificationService;
