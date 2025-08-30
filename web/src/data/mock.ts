import type { Deployment, Service } from '../types';

export const services: Service[] = [
  { id: 'svc-auth', name: 'Auth Service', environment: 'dev', status: 'healthy', description: 'Handles user authentication and session management.', owner: 'platform@company.com', repoUrl: 'https://github.com/org/auth-service', lastDeployAt: '2025-01-10T10:15:00Z' },
  { id: 'svc-pay', name: 'Payments', environment: 'staging', status: 'degraded', description: 'Processes payments and refunds.', owner: 'finops@company.com', repoUrl: 'https://github.com/org/payments', lastDeployAt: '2025-01-11T08:20:00Z' },
  { id: 'svc-catalog', name: 'Catalog', environment: 'prod', status: 'healthy', description: 'Product catalog and search indexing.', owner: 'retail@company.com', repoUrl: 'https://github.com/org/catalog', lastDeployAt: '2025-01-12T12:05:00Z' },
  { id: 'svc-orders', name: 'Orders', environment: 'prod', status: 'down', description: 'Order intake and fulfillment pipeline.', owner: 'ops@company.com', repoUrl: 'https://github.com/org/orders', lastDeployAt: '2025-01-09T16:42:00Z' },
  { id: 'svc-analytics', name: 'Analytics', environment: 'dev', status: 'healthy', description: 'User behavior analytics processing.', owner: 'data@company.com', repoUrl: 'https://github.com/org/analytics', lastDeployAt: '2025-01-12T09:00:00Z' },
  { id: 'svc-email', name: 'Email', environment: 'staging', status: 'healthy', description: 'Transactional email delivery.', owner: 'comm@company.com', repoUrl: 'https://github.com/org/email', lastDeployAt: '2025-01-12T11:30:00Z' }
];

export const deployments: Deployment[] = [
  { id: 'd1', serviceId: 'svc-auth', serviceName: 'Auth Service', environment: 'dev', time: '2025-01-10T10:15:00Z', status: 'success' },
  { id: 'd2', serviceId: 'svc-auth', serviceName: 'Auth Service', environment: 'dev', time: '2025-01-08T09:00:00Z', status: 'failed' },
  { id: 'd3', serviceId: 'svc-pay', serviceName: 'Payments', environment: 'staging', time: '2025-01-11T08:20:00Z', status: 'success' },
  { id: 'd4', serviceId: 'svc-pay', serviceName: 'Payments', environment: 'staging', time: '2025-01-09T14:10:00Z', status: 'failed' },
  { id: 'd5', serviceId: 'svc-catalog', serviceName: 'Catalog', environment: 'prod', time: '2025-01-12T12:05:00Z', status: 'success' },
  { id: 'd6', serviceId: 'svc-catalog', serviceName: 'Catalog', environment: 'prod', time: '2025-01-07T07:25:00Z', status: 'success' },
  { id: 'd7', serviceId: 'svc-orders', serviceName: 'Orders', environment: 'prod', time: '2025-01-09T16:42:00Z', status: 'failed' },
  { id: 'd8', serviceId: 'svc-orders', serviceName: 'Orders', environment: 'prod', time: '2025-01-08T15:30:00Z', status: 'in_progress' },
  { id: 'd9', serviceId: 'svc-analytics', serviceName: 'Analytics', environment: 'dev', time: '2025-01-12T09:00:00Z', status: 'success' },
  { id: 'd10', serviceId: 'svc-email', serviceName: 'Email', environment: 'staging', time: '2025-01-12T11:30:00Z', status: 'success' },
  { id: 'd11', serviceId: 'svc-email', serviceName: 'Email', environment: 'staging', time: '2025-01-10T11:30:00Z', status: 'failed' },
  { id: 'd12', serviceId: 'svc-auth', serviceName: 'Auth Service', environment: 'dev', time: '2025-01-06T12:00:00Z', status: 'success' },
  { id: 'd13', serviceId: 'svc-pay', serviceName: 'Payments', environment: 'staging', time: '2025-01-05T10:00:00Z', status: 'in_progress' },
  { id: 'd14', serviceId: 'svc-catalog', serviceName: 'Catalog', environment: 'prod', time: '2025-01-04T09:00:00Z', status: 'success' },
  { id: 'd15', serviceId: 'svc-orders', serviceName: 'Orders', environment: 'prod', time: '2025-01-03T16:15:00Z', status: 'failed' },
  { id: 'd16', serviceId: 'svc-analytics', serviceName: 'Analytics', environment: 'dev', time: '2025-01-02T10:10:00Z', status: 'success' },
  { id: 'd17', serviceId: 'svc-analytics', serviceName: 'Analytics', environment: 'dev', time: '2025-01-01T08:05:00Z', status: 'success' },
  { id: 'd18', serviceId: 'svc-email', serviceName: 'Email', environment: 'staging', time: '2025-01-01T07:00:00Z', status: 'success' }
];
