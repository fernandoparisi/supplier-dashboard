import { useState } from 'react';
import LightPillar from './LightPillar/LightPillar';

const years = ['TODOS', 2018,2019,2020,2021,2022,2023,2024,2025];
const metrics = [
  ['Lead time promedio','—','días'],
  ['OTD','—','%'],
  ['Unidades recibidas','—','unidades'],
  ['Proveedores','14','activos']
];

export default function App(){
  const [year,setYear]=useState('TODOS');
  return <main>
    <section className="hero">
      <div className="hero-light"><LightPillar topColor="#5227FF" bottomColor="#434b8a" intensity={1} rotationSpeed={0.3} glowAmount={0.005} pillarWidth={3} pillarHeight={0.4} noiseIntensity={0.5} pillarRotation={0} interactive={false} mixBlendMode="normal" /></div>
      <nav><div className="logo"><span>OPS</span>NOVA<i /></div><div className="tag">INTELIGENCIA OPERACIONAL</div></nav>
      <div className="hero-content">
        <div className="eyebrow">OPERATIONAL INTELLIGENCE / 2026</div>
        <h1>Convertimos datos<br/><em>operacionales</em> en decisiones.</h1>
        <p>Analítica aplicada a supply chain, proveedores y operaciones para detectar riesgos antes de que impacten el negocio.</p>
        <div className="actions"><a className="primary" href="#dashboard">Explorar dashboard <span>↗</span></a><a className="secondary" href="mailto:contacto@opsnova.com">Hablar con OPSNOVA</a></div>
      </div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span>OPSNOVA / OPERATIONAL ANALYTICS</span></div>
    </section>

    <section className="section" id="dashboard">
      <div className="section-head"><div><div className="eyebrow">SUPPLIER PERFORMANCE</div><h2>De los datos a la señal.</h2></div><div className="demo">DEMO DATA · 2018—2025</div></div>
      <div className="yearbar">{years.map(y=><button key={y} className={year===y?'active':''} onClick={()=>setYear(y)}>{y}</button>)}</div>
      <div className="kpis">{metrics.map(([label,value,sub])=><article key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</div>
      <div className="insight"><div className="signal">●</div><div><span>OPSNOVA SIGNAL</span><p>En análisis histórico de proveedores, el tiempo de entrega puede deteriorarse mucho antes de que aparezca un problema evidente en disponibilidad. La señal temprana está en la evolución del lead time.</p></div></div>
    </section>

    <section className="section services"><div className="eyebrow">WHAT WE DO</div><h2>Inteligencia operacional, aplicada.</h2><div className="service-grid"><article><b>01</b><h3>Supplier Analytics</h3><p>Performance, lead time, OTD, riesgo y concentración de proveedores.</p></article><article><b>02</b><h3>Operational Dashboards</h3><p>Dashboards ejecutivos conectados con los indicadores que realmente importan.</p></article><article><b>03</b><h3>Data → Decisions</h3><p>Transformamos datos operativos dispersos en señales accionables.</p></article></div></section>

    <footer><div className="logo"><span>OPS</span>NOVA<i /></div><p>Operational intelligence for industry.</p><span>© 2026 OPSNOVA</span></footer>
  </main>
}
