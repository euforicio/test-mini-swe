import { useEffect, useMemo, useState } from 'react';
import { getDeployments, getServices } from '../data/source';
import type { Deployment, Service } from '../types';
import ServicesTable from '../components/ServicesTable';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    getServices().then(setServices);
    getDeployments().then(setDeployments);
  }, []);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return services;
    return services.filter(s => s.name.toLowerCase().includes(term));
  }, [q, services]);

  return (
    <div className="container">
      <div className="section-title">
        <h2>Services</h2>
        <div style={{minWidth: '220px'}}>
          <label htmlFor="search" className="small">Search</label>
          <input id="search" aria-label="Search services" className="input" placeholder="Search by name..." value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>
      <ServicesTable services={filtered} deployments={deployments} />
    </div>
  );
}
