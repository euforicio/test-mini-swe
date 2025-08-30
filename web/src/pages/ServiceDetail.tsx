import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDeploymentsForService, getServiceById } from '../data/source';
import type { Deployment, Service } from '../types';
import { DeployStatusBadge, ServiceStatusBadge } from '../components/StatusBadge';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | undefined>();
  const [recent, setRecent] = useState<Deployment[]>([]);
  useEffect(() => {
    if (!serviceId) return;
    getServiceById(serviceId).then(setService);
    getDeploymentsForService(serviceId).then(d => setRecent(d.slice(0,5)));
  }, [serviceId]);

  if (!service) {
    return (
      <div className="container">
        <div className="card">Loading service…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-title">
        <h2>{service.name}</h2>
        <Link to="/services" className="link small">← Back to Services</Link>
      </div>
      <div className="grid cols-2">
        <div className="card">
          <h3>Overview</h3>
          <div className="mt-1">{service.description}</div>
          <div className="mt-1 small">Owner: <strong>{service.owner}</strong></div>
          <div className="mt-1 small">Environment: <strong>{service.environment.toUpperCase()}</strong></div>
          <div className="mt-1"><ServiceStatusBadge status={service.status} /></div>
          {service.repoUrl && <div className="mt-1 small">Repo: <a className="link" href={service.repoUrl} target="_blank" rel="noreferrer">{service.repoUrl}</a></div>}
          <div className="mt-2 row">
            <button className="btn" disabled>Create Deploy</button>
            <button className="btn" disabled>View Logs</button>
            <button className="btn" disabled>Settings</button>
          </div>
        </div>
        <div className="card">
          <h3>Recent Deployments</h3>
          <div className="table-wrap mt-1">
            <table>
              <thead><tr><th>Status</th><th>Env</th><th>Time</th></tr></thead>
              <tbody>
                {recent.map(d=>(
                  <tr key={d.id}>
                    <td><DeployStatusBadge status={d.status} /></td>
                    <td>{d.environment.toUpperCase()}</td>
                    <td>{new Date(d.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
