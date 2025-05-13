import { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  EmitterSubscription,
  NativeModules,
} from "react-native";

interface Notification {
  packageName: string;
  title: string;
  text: string;
}

const { NotificationListener } = NativeModules;

export const useNotificationListener = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let subscription: EmitterSubscription;

    const setupListener = async () => {
      try {
        // Request notification access permission
        await NotificationListener.requestPermission();
        // Listen for notifications
        subscription = DeviceEventEmitter.addListener(
          "onNotificationReceived",
          (notification: Notification) => {
            setNotifications((prev) => [...prev, notification]);
            console.log("Notification:", notification);
          }
        );
      } catch (error) {
        console.error("Failed to set up notification listener:", error);
      }
    };

    setupListener();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return {
    notifications,
    requestPermission: NotificationListener.requestPermission,
  };
};
