import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Issue, User, Label, Milestone, Comment, LinkedIssue, Attachment } from '../types';
import { generateId } from '../utils/helpers';

export function useIssues() {
  const [issues, setIssues] = useLocalStorage<Issue[]>('issues', []);
  const [currentUser] = useLocalStorage<User>('current-user', {} as User);

  const createIssue = useCallback((issueData: Omit<Issue, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'comments' | 'linkedIssues' | 'attachments' | 'watchers' | 'reactions'>) => {
    const issueNumber = Math.max(0, ...issues.map(i => i.number)) + 1;
    
    const newIssue: Issue = {
      ...issueData,
      id: generateId(),
      number: issueNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      linkedIssues: [],
      attachments: [],
      watchers: [issueData.author],
      reactions: []
    };

    setIssues(prev => [...prev, newIssue]);
    return newIssue;
  }, [setIssues, issues]);

  const updateIssue = useCallback((issueId: string, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, ...updates, updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  const closeIssue = useCallback((issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, state: 'closed', closedAt: new Date(), updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  const reopenIssue = useCallback((issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, state: 'open', closedAt: undefined, updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  const addComment = useCallback((issueId: string, content: string) => {
    const newComment: Comment = {
      id: generateId(),
      content,
      author: currentUser,
      createdAt: new Date(),
      isEdited: false,
      reactions: [],
      mentions: []
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            comments: [...issue.comments, newComment],
            updatedAt: new Date()
          }
        : issue
    ));
  }, [setIssues, currentUser]);

  const linkIssue = useCallback((issueId: string, linkedIssueId: string, type: LinkedIssue['type']) => {
    const linkedIssue = issues.find(i => i.id === linkedIssueId);
    if (!linkedIssue) return;

    const newLink: LinkedIssue = {
      id: generateId(),
      type,
      issue: linkedIssue
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            linkedIssues: [...issue.linkedIssues, newLink],
            updatedAt: new Date()
          }
        : issue
    ));
  }, [setIssues, issues]);

  const addAttachment = useCallback((issueId: string, attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => {
    const newAttachment: Attachment = {
      ...attachment,
      id: generateId(),
      uploadedAt: new Date()
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            attachments: [...issue.attachments, newAttachment],
            updatedAt: new Date()
          }
        : issue
    ));
  }, [setIssues]);

  const addWatcher = useCallback((issueId: string, user: User) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            watchers: [...issue.watchers.filter(w => w.id !== user.id), user],
            updatedAt: new Date()
          }
        : issue
    ));
  }, [setIssues]);

  const removeWatcher = useCallback((issueId: string, userId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            watchers: issue.watchers.filter(w => w.id !== userId),
            updatedAt: new Date()
          }
        : issue
    ));
  }, [setIssues]);

  const assignIssue = useCallback((issueId: string, assignees: User[]) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignees, updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  const setIssueMilestone = useCallback((issueId: string, milestone?: Milestone) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, milestone, updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  const bulkUpdateIssues = useCallback((issueIds: string[], updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issueIds.includes(issue.id)
        ? { ...issue, ...updates, updatedAt: new Date() }
        : issue
    ));
  }, [setIssues]);

  return {
    issues,
    createIssue,
    updateIssue,
    closeIssue,
    reopenIssue,
    addComment,
    linkIssue,
    addAttachment,
    addWatcher,
    removeWatcher,
    assignIssue,
    setIssueMilestone,
    bulkUpdateIssues,
  };
}