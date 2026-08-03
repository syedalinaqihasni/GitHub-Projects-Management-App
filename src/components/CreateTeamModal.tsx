import React, { useState } from 'react';
import { X, Plus, Users, Globe, Lock } from 'lucide-react';
import { Team } from '../types';

interface CreateTeamModalProps {
  team?: Team | null;
  onClose: () => void;
  onCreate: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'projects' | 'repositories'>) => void;
}

export function CreateTeamModal({ team, onClose, onCreate }: CreateTeamModalProps) {
  const [name, setName] = useState(team?.name || '');
  const [description, setDescription] = useState(team?.description || '');
  const [slug, setSlug] = useState(team?.slug || '');
  const [privacy, setPrivacy] = useState<'public' | 'private'>(team?.privacy || 'private');
  const [avatar, setAvatar] = useState(team?.avatar || '');

  const isEditing = !!team;

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      slug: slug.trim(),
      privacy,
      avatar: avatar.trim() || undefined,
      settings: {
        allowMemberInvites: true,
        requireApprovalForNewMembers: false,
        defaultMemberRole: 'member',
        visibility: privacy
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {isEditing ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {/* Team Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Team Slug */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Slug *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-2">@</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="team-slug"
                pattern="[a-z0-9-]+"
                required
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your team..."
            />
          </div>

          {/* Avatar URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Privacy */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacy
            </label>
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="radio"
                  value="private"
                  checked={privacy === 'private'}
                  onChange={(e) => setPrivacy(e.target.value as 'private')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Private</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Only team members can see this team and its projects
                  </div>
                </div>
              </label>
              
              <label className="flex items-start">
                <input
                  type="radio"
                  value="public"
                  checked={privacy === 'public'}
                  onChange={(e) => setPrivacy(e.target.value as 'public')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Public</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Anyone can see this team and its public projects
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !slug.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Team' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}