import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Team, TeamMember, User, TeamSettings, Repository } from '../types';
import { generateId } from '../utils/helpers';

export function useTeams() {
  const [teams, setTeams] = useLocalStorage<Team[]>('teams', []);
  const [currentUser] = useLocalStorage<User>('current-user', {} as User);

  const createTeam = useCallback((teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'projects' | 'repositories'>) => {
    const newTeam: Team = {
      ...teamData,
      id: generateId(),
      members: [{
        user: currentUser,
        role: 'maintainer',
        joinedAt: new Date(),
        permissions: []
      }],
      projects: [],
      repositories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowMemberInvites: true,
        requireApprovalForNewMembers: false,
        defaultMemberRole: 'member',
        visibility: 'private'
      }
    };

    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  }, [setTeams, currentUser]);

  const updateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, ...updates, updatedAt: new Date() }
        : team
    ));
  }, [setTeams]);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  }, [setTeams]);

  const addTeamMember = useCallback((teamId: string, user: User, role: 'maintainer' | 'member' = 'member') => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const newMember: TeamMember = {
          user,
          role,
          joinedAt: new Date(),
          permissions: []
        };
        return {
          ...team,
          members: [...team.members, newMember],
          updatedAt: new Date()
        };
      }
      return team;
    }));
  }, [setTeams]);

  const removeTeamMember = useCallback((teamId: string, userId: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(member => member.user.id !== userId),
          updatedAt: new Date()
        };
      }
      return team;
    }));
  }, [setTeams]);

  const updateMemberRole = useCallback((teamId: string, userId: string, role: 'maintainer' | 'member') => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map(member => 
            member.user.id === userId 
              ? { ...member, role }
              : member
          ),
          updatedAt: new Date()
        };
      }
      return team;
    }));
  }, [setTeams]);

  const addRepository = useCallback((teamId: string, repository: Repository) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          repositories: [...team.repositories, repository],
          updatedAt: new Date()
        };
      }
      return team;
    }));
  }, [setTeams]);

  const updateTeamSettings = useCallback((teamId: string, settings: Partial<TeamSettings>) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          settings: { ...team.settings, ...settings },
          updatedAt: new Date()
        };
      }
      return team;
    }));
  }, [setTeams]);

  return {
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
    addRepository,
    updateTeamSettings,
  };
}