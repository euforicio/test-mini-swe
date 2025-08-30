import { useNavigate } from 'react-router-dom';
import type { Service, Deployment } from '../types';
import { ServiceStatusBadge } from './StatusBadge';

export default function ServicesTable({ services, deployments }: { services: Service[]; deployments: Deployment[] }) {
  const nav = useNavigate();
  const lastDeployMap = new Map<string, string>();
  deployments.forEach(d => {
    const cur = lastDeployMap.get(d.serviceId);
    if (!cur || cur < d.time) lastDeployMap.set(d.serviceId, d.time);
  });
  return (
    <div className="table-wrap" role="table" aria-label="Services table">
      <table>
        <thead>
          <tr><th>Service</th><th>Environment</th><th>Status</th><th>Last Deploy</th><th>Action</th></tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} onClick={() => nav(`/services/${s.id}`)} style={{cursor:'pointer'}}>
              <td>{s.name}</td>
              <td>{s.environment.toUpperCase()}</td>
              <td><ServiceStatusBadge status={s.status} /></td>
              <td>{lastDeployMap.get(s.id) ? new Date(lastDeployMap.get(s.id)!).toLocaleString() : '—'}</td>
              <td><button className="btn" onClick={(e) => { e.stopPropagation(); nav(`/services/${s.id}`); }}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
