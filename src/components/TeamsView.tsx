import React, { useState } from 'react';
import { Plus, Users, Settings, Search, Globe, Lock, Crown, User } from 'lucide-react';
import { Team, User as UserType } from '../types';
import { formatRelativeTime } from '../utils/helpers';

interface TeamsViewProps {
  teams: Team[];
  currentUser: UserType;
  onCreateTeam: () => void;
  onSelectTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
}

export function TeamsView({ teams, currentUser, onCreateTeam, onSelectTeam, onEditTeam, onDeleteTeam }: TeamsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserRole = (team: Team) => {
    const member = team.members.find(m => m.user.id === currentUser.id);
    return member?.role || 'viewer';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Collaborate with your team members across projects
          </p>
        </div>
        
        <button
          onClick={onCreateTeam}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Team
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTeams.length} of {teams.length} teams
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const userRole = getUserRole(team);
            const canEdit = userRole === 'maintainer';
            
            return (
              <div
                key={team.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {team.avatar ? (
                        <img
                          src={team.avatar}
                          alt={team.name}
                          className="w-12 h-12 rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => onSelectTeam(team)}
                        >
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{team.slug}</p>
                      </div>
                    </div>
                    
                    {canEdit && (
                      <button
                        onClick={() => onEditTeam(team)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {team.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{team.members.length} members</span>
                      </div>
                      <div className="flex items-center">
                        {team.privacy === 'public' ? (
                          <Globe className="w-4 h-4 mr-1" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1" />
                        )}
                        <span>{team.privacy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userRole === 'maintainer' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {userRole === 'maintainer' && <Crown className="w-3 h-3 mr-1" />}
                        {userRole === 'member' && <User className="w-3 h-3 mr-1" />}
                        {userRole}
                      </span>
                    </div>

                    <div className="flex -space-x-2">
                      {team.members.slice(0, 4).map((member, index) => (
                        <img
                          key={member.user.id}
                          src={member.user.avatar}
                          alt={member.user.name}
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                          title={`${member.user.name} (${member.role})`}
                        />
                      ))}
                      {team.members.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            +{team.members.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created {formatRelativeTime(team.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            {searchQuery ? 'No teams found matching your search' : 'No teams yet'}
          </div>
          {!searchQuery && (
            <button
              onClick={onCreateTeam}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create your first team
            </button>
          )}
        </div>
      )}
    </div>
  );
}