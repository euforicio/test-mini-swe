import { services as mockServices, deployments as mockDeployments } from './mock';
import type { Deployment, Service } from '../types';

const useApi = import.meta.env.VITE_USE_API === 'true';

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  if (useApi) {
    const fromApi = await safeFetch<Service[]>('/api/services');
    if (fromApi) return fromApi;
  }
  return Promise.resolve(mockServices);
}

export async function getDeployments(): Promise<Deployment[]> {
  if (useApi) {
    const fromApi = await safeFetch<Deployment[]>('/api/deployments');
    if (fromApi) return fromApi;
  }
  return Promise.resolve(mockDeployments);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const list = await getServices();
  return list.find(s => s.id === id);
}

export async function getDeploymentsForService(id: string): Promise<Deployment[]> {
  const deps = await getDeployments();
  return deps.filter(d => d.serviceId === id).sort((a,b)=> (a.time < b.time ? 1 : -1));
}
