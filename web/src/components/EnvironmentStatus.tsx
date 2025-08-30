import type { Service } from '../types';
import { ServiceStatusBadge } from './StatusBadge';

function aggregateStatus(items: Service[]) {
  if (items.every(s => s.status === 'healthy')) return 'healthy' as const;
  if (items.some(s => s.status === 'down')) return 'down' as const;
  return 'degraded' as const;
}

export default function EnvironmentStatus({ services }: { services: Service[] }) {
  const envs = ['dev','staging','prod'] as const;
  return (
    <div className="grid cols-3">
      {envs.map(env => {
        const list = services.filter(s => s.environment === env);
        const agg = aggregateStatus(list);
        return (
          <div key={env} className="card">
            <h3>{env.toUpperCase()}</h3>
            <div className="row">
              <ServiceStatusBadge status={agg} />
              <span className="small">{list.length} services</span>
            </div>
            <div className="mt-1 small">
              Healthy: {list.filter(s=>s.status==='healthy').length} • Degraded: {list.filter(s=>s.status==='degraded').length} • Down: {list.filter(s=>s.status==='down').length}
            </div>
          </div>
        );
      })}
    </div>
  );
}
