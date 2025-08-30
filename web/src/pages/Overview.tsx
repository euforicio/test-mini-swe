import { useEffect, useState } from 'react';
import { getDeployments, getServices } from '../data/source';
import type { Deployment, Service } from '../types';
import EnvironmentStatus from '../components/EnvironmentStatus';
import RecentDeployments from '../components/RecentDeployments';

export default function Overview() {
  const [services, setServices] = useState<Service[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  useEffect(() => {
    getServices().then(setServices);
    getDeployments().then(setDeployments);
  }, []);
  const totalServices = services.length;
  const environments = new Set(services.map(s=>s.environment)).size;
  const healthy = services.filter(s=>s.status==='healthy').length;
  const failedDeploys = deployments.filter(d=>d.status==='failed').length;

  return (
    <div className="container">
      <div className="grid cols-4">
        <div className="card"><h3>Total Services</h3><div className="value" aria-label="Total Services">{totalServices}</div></div>
        <div className="card"><h3>Environments</h3><div className="value" aria-label="Environments">{environments}</div></div>
        <div className="card"><h3>Healthy Services</h3><div className="value" aria-label="Healthy Services">{(healthy)}</div></div>
        <div className="card"><h3>Failed Deployments</h3><div className="value" aria-label="Failed Deployments">{failedDeploys}</div></div>
      </div>

      <div className="mt-2">
        <div className="section-title"><h2>Environments</h2></div>
        <EnvironmentStatus services={services} />
      </div>

      <div className="mt-2">
        <RecentDeployments deployments={deployments} />
      </div>
    </div>
  );
}
