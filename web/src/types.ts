export type Environment = 'dev' | 'staging' | 'prod';
export type ServiceStatus = 'healthy' | 'degraded' | 'down';
export type DeployStatus = 'success' | 'failed' | 'in_progress';

export interface Service {
  id: string;
  name: string;
  environment: Environment;
  status: ServiceStatus;
  description: string;
  owner: string;
  repoUrl?: string;
  lastDeployAt?: string;
}

export interface Deployment {
  id: string;
  serviceId: string;
  serviceName: string;
  environment: Environment;
  time: string; // ISO
  status: DeployStatus;
}
