import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Notification, User } from '../types';
import { generateId } from '../utils/helpers';

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [currentUser] = useLocalStorage<User>('current-user', {} as User);

  const createNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100 notifications
    return newNotification;
  }, [setNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  }, [setNotifications]);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.isRead && n.recipient.id === currentUser.id).length;
  }, [notifications, currentUser.id]);

  const getUserNotifications = useCallback((userId: string) => {
    return notifications.filter(n => n.recipient.id === userId);
  }, [notifications]);

  // Auto-create notifications for mentions, assignments, etc.
  const notifyMention = useCallback((mentionedUser: User, sender: User, entityType: string, entityId: string, entityTitle: string) => {
    createNotification({
      type: 'mention',
      title: 'You were mentioned',
      message: `${sender.name} mentioned you in ${entityType}`,
      recipient: mentionedUser,
      sender,
      relatedEntity: {
        type: entityType as any,
        id: entityId,
        title: entityTitle
      },
      actionUrl: `/${entityType}/${entityId}`
    });
  }, [createNotification]);

  const notifyAssignment = useCallback((assignedUser: User, assigner: User, entityType: string, entityId: string, entityTitle: string) => {
    createNotification({
      type: 'assignment',
      title: 'You were assigned',
      message: `${assigner.name} assigned you to ${entityType}: ${entityTitle}`,
      recipient: assignedUser,
      sender: assigner,
      relatedEntity: {
        type: entityType as any,
        id: entityId,
        title: entityTitle
      },
      actionUrl: `/${entityType}/${entityId}`
    });
  }, [createNotification]);

  const notifyComment = useCallback((recipient: User, commenter: User, entityType: string, entityId: string, entityTitle: string) => {
    createNotification({
      type: 'comment',
      title: 'New comment',
      message: `${commenter.name} commented on ${entityType}: ${entityTitle}`,
      recipient,
      sender: commenter,
      relatedEntity: {
        type: entityType as any,
        id: entityId,
        title: entityTitle
      },
      actionUrl: `/${entityType}/${entityId}`
    });
  }, [createNotification]);

  const notifyDueDate = useCallback((assignedUser: User, entityType: string, entityId: string, entityTitle: string, dueDate: Date) => {
    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    createNotification({
      type: 'due_date',
      title: 'Due date approaching',
      message: `${entityTitle} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
      recipient: assignedUser,
      relatedEntity: {
        type: entityType as any,
        id: entityId,
        title: entityTitle
      },
      actionUrl: `/${entityType}/${entityId}`
    });
  }, [createNotification]);

  return {
    notifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    getUserNotifications,
    notifyMention,
    notifyAssignment,
    notifyComment,
    notifyDueDate,
  };
}