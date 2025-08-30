import { useEffect, useState } from 'react';
import { getDeployments } from '../data/source';
import type { Deployment } from '../types';
import { DeployStatusBadge } from '../components/StatusBadge';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  useEffect(() => { getDeployments().then(setDeployments); }, []);
  const latest = [...deployments].sort((a,b)=> (a.time < b.time ? 1 : -1)).slice(0, 20);
  return (
    <div className="container">
      <div className="card">
        <div className="section-title"><h2>Deployments</h2></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Service</th><th>Environment</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {latest.map(d=>(
                <tr key={d.id}>
                  <td>{d.serviceName}</td>
                  <td>{d.environment.toUpperCase()}</td>
                  <td>{new Date(d.time).toLocaleString()}</td>
                  <td><DeployStatusBadge status={d.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
