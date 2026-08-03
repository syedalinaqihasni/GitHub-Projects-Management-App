import React, { useState } from 'react';
import { Code, Copy, Check, Download, Upload, Search, Filter } from 'lucide-react';
import { APIEndpoint } from '../types';

interface APIDocumentationProps {
  onExportAPI: (projectId: string, format: 'json' | 'csv' | 'xml') => void;
  onImportAPI: (data: any, options: any) => void;
}

export function APIDocumentation({ onExportAPI, onImportAPI }: APIDocumentationProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/projects',
      description: 'Get all projects',
      parameters: [
        { name: 'page', type: 'number', required: false, description: 'Page number for pagination', example: 1 },
        { name: 'limit', type: 'number', required: false, description: 'Number of items per page', example: 20 },
        { name: 'search', type: 'string', required: false, description: 'Search query', example: 'my project' }
      ],
      response: {
        projects: [],
        pagination: { page: 1, limit: 20, total: 100, totalPages: 5 }
      }
    },
    {
      method: 'POST',
      path: '/api/projects',
      description: 'Create a new project',
      parameters: [
        { name: 'title', type: 'string', required: true, description: 'Project title', example: 'My New Project' },
        { name: 'description', type: 'string', required: false, description: 'Project description', example: 'A sample project' },
        { name: 'visibility', type: 'string', required: true, description: 'Project visibility', example: 'private' }
      ],
      response: { id: 'proj_123', title: 'My New Project', createdAt: '2024-01-01T00:00:00Z' }
    },
    {
      method: 'GET',
      path: '/api/projects/{id}',
      description: 'Get a specific project',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Project ID', example: 'proj_123' }
      ],
      response: { id: 'proj_123', title: 'My Project', columns: [], cards: [] }
    },
    {
      method: 'PUT',
      path: '/api/projects/{id}',
      description: 'Update a project',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Project ID', example: 'proj_123' },
        { name: 'title', type: 'string', required: false, description: 'New project title', example: 'Updated Project' }
      ],
      response: { id: 'proj_123', title: 'Updated Project', updatedAt: '2024-01-01T00:00:00Z' }
    },
    {
      method: 'DELETE',
      path: '/api/projects/{id}',
      description: 'Delete a project',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Project ID', example: 'proj_123' }
      ],
      response: { success: true, message: 'Project deleted successfully' }
    },
    {
      method: 'GET',
      path: '/api/projects/{id}/cards',
      description: 'Get all cards in a project',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Project ID', example: 'proj_123' },
        { name: 'column', type: 'string', required: false, description: 'Filter by column ID', example: 'col_456' }
      ],
      response: { cards: [], total: 10 }
    },
    {
      method: 'POST',
      path: '/api/projects/{id}/cards',
      description: 'Create a new card',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Project ID', example: 'proj_123' },
        { name: 'title', type: 'string', required: true, description: 'Card title', example: 'New Task' },
        { name: 'columnId', type: 'string', required: true, description: 'Column ID', example: 'col_456' }
      ],
      response: { id: 'card_789', title: 'New Task', createdAt: '2024-01-01T00:00:00Z' }
    },
    {
      method: 'GET',
      path: '/api/issues',
      description: 'Get all issues',
      parameters: [
        { name: 'state', type: 'string', required: false, description: 'Filter by state', example: 'open' },
        { name: 'assignee', type: 'string', required: false, description: 'Filter by assignee', example: 'user_123' }
      ],
      response: { issues: [], total: 25 }
    },
    {
      method: 'POST',
      path: '/api/issues',
      description: 'Create a new issue',
      parameters: [
        { name: 'title', type: 'string', required: true, description: 'Issue title', example: 'Bug in login' },
        { name: 'type', type: 'string', required: true, description: 'Issue type', example: 'bug' },
        { name: 'priority', type: 'string', required: true, description: 'Issue priority', example: 'high' }
      ],
      response: { id: 'issue_456', number: 1, title: 'Bug in login', createdAt: '2024-01-01T00:00:00Z' }
    },
    {
      method: 'GET',
      path: '/api/teams',
      description: 'Get all teams',
      parameters: [
        { name: 'privacy', type: 'string', required: false, description: 'Filter by privacy', example: 'public' }
      ],
      response: { teams: [], total: 5 }
    },
    {
      method: 'POST',
      path: '/api/teams',
      description: 'Create a new team',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Team name', example: 'Development Team' },
        { name: 'slug', type: 'string', required: true, description: 'Team slug', example: 'dev-team' }
      ],
      response: { id: 'team_789', name: 'Development Team', createdAt: '2024-01-01T00:00:00Z' }
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateCurlExample = (endpoint: APIEndpoint) => {
    const baseUrl = 'https://api.yourapp.com';
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
    
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_TOKEN"`;
      
      if (endpoint.parameters?.some(p => p.required)) {
        const bodyParams = endpoint.parameters.filter(p => p.name !== 'id').reduce((acc, param) => {
          if (param.example) {
            acc[param.name] = param.example;
          }
          return acc;
        }, {} as any);
        
        if (Object.keys(bodyParams).length > 0) {
          curl += ` \\\n  -d '${JSON.stringify(bodyParams, null, 2)}'`;
        }
      }
    } else {
      curl += ` \\\n  -H "Authorization: Bearer YOUR_API_TOKEN"`;
    }
    
    return curl;
  };

  const generateJavaScriptExample = (endpoint: APIEndpoint) => {
    const baseUrl = 'https://api.yourapp.com';
    let js = `const response = await fetch('${baseUrl}${endpoint.path}', {\n`;
    js += `  method: '${endpoint.method}',\n`;
    js += `  headers: {\n`;
    js += `    'Authorization': 'Bearer YOUR_API_TOKEN',\n`;
    
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      js += `    'Content-Type': 'application/json',\n`;
      js += `  },\n`;
      
      if (endpoint.parameters?.some(p => p.required)) {
        const bodyParams = endpoint.parameters.filter(p => p.name !== 'id').reduce((acc, param) => {
          if (param.example) {
            acc[param.name] = param.example;
          }
          return acc;
        }, {} as any);
        
        if (Object.keys(bodyParams).length > 0) {
          js += `  body: JSON.stringify(${JSON.stringify(bodyParams, null, 4)}),\n`;
        }
      }
    } else {
      js += `  },\n`;
    }
    
    js += `});\n\nconst data = await response.json();\nconsole.log(data);`;
    
    return js;
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'POST': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'PUT': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'DELETE': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Complete API reference for integrating with your projects
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Export Data</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Download project data via API</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
              <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Import Data</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Upload data using API endpoints</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">Webhooks</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Real-time event notifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Endpoints</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            All API endpoints require authentication via Bearer token
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                
                <button
                  onClick={() => setSelectedEndpoint(selectedEndpoint === `${index}` ? null : `${index}`)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {selectedEndpoint === `${index}` ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{endpoint.description}</p>

              {selectedEndpoint === `${index}` && (
                <div className="space-y-6">
                  {/* Parameters */}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Required
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {endpoint.parameters.map((param, paramIndex) => (
                              <tr key={paramIndex}>
                                <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-white">
                                  {param.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                  {param.type}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    param.required 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {param.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                  {param.description}
                                  {param.example && (
                                    <div className="mt-1">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">Example: </span>
                                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                                        {JSON.stringify(param.example)}
                                      </code>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Response Example */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Response Example</h4>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2), `response-${index}`)}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 rounded"
                      >
                        {copiedCode === `response-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Code Examples */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Code Examples</h4>
                    
                    {/* cURL Example */}
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">cURL</h5>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{generateCurlExample(endpoint)}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(generateCurlExample(endpoint), `curl-${index}`)}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 rounded"
                        >
                          {copiedCode === `curl-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* JavaScript Example */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">JavaScript</h5>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{generateJavaScriptExample(endpoint)}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(generateJavaScriptExample(endpoint), `js-${index}`)}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 rounded"
                        >
                          {copiedCode === `js-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          All API requests require authentication using a Bearer token in the Authorization header.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Example Request</h3>
          <pre className="text-sm text-gray-700 dark:text-gray-300">
            <code>
{`Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json`}
            </code>
          </pre>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-400">
            <strong>Note:</strong> You can generate API tokens in your account settings. Keep your tokens secure and never share them publicly.
          </p>
        </div>
      </div>
    </div>
  );
}