import type { Project } from '../components/Types';

const API_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	headers?: Record<string, string>;
	body?: unknown;
	token?: string | null;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
	const { method = 'GET', body, headers = {}, token } = options;

	const response = await fetch(`${API_BASE}${path}`, {
		method,
		headers: {
			...(body ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data?.message || `Request failed (${response.status})`);
	}

	return data as T;
};

export const api = {
	getPublishedProjects: () => request<{ projects: Project[] }>('/api/projects/published'),
	getUserProjects: (userId: string) =>
		request<{ projects: Project[] }>(`/api/projects?userId=${encodeURIComponent(userId)}`),
	deleteProject: (projectId: string, token: string) =>
		request<{ success: boolean; message: string }>(`/api/projects/${projectId}`, {
			method: 'DELETE',
			token,
		}),
	toggleProjectPublished: (projectId: string, userId: string, token: string) =>
		request<{ project: Project; isPublished: boolean }>(`/api/projects/${projectId}/toggle-public`, {
			method: 'PATCH',
			token,
			body: { userId },
		}),
};
