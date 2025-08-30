import type { ServiceStatus, DeployStatus } from '../types';

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const label = status === 'healthy' ? 'Healthy' : status === 'degraded' ? 'Degraded' : 'Down';
  const cls = status === 'healthy' ? 'badge ok' : status === 'degraded' ? 'badge warn' : 'badge err';
  return <span className={cls} aria-label={`Service status ${label}`}>{label}</span>;
}

export function DeployStatusBadge({ status }: { status: DeployStatus }) {
  const label = status === 'success' ? 'Success' : status === 'failed' ? 'Failed' : 'In progress';
  const cls = status === 'success' ? 'badge ok' : status === 'failed' ? 'badge err' : 'badge warn';
  return <span className={cls} aria-label={`Deployment status ${label}`}>{label}</span>;
}
