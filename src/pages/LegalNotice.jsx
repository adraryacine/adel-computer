import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';

const LegalNotice = () => (
  <div style={{background: 'var(--bg-tertiary)', minHeight: '100vh', padding: '3em 0'}}>
    <div className="container">
      <div className="card legal-notice-card" style={{maxWidth: 700, margin: '0 auto', padding: '2.5em 2em', boxShadow: '0 8px 32px rgba(37,99,235,0.10)', animation: 'fadeInUp 0.7s'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1.5em'}}>
          <FaBalanceScale size={36} style={{color: 'var(--accent-primary)'}} />
          <div>
            <h1 style={{margin: 0}}>Mentions légales</h1>
            <span style={{color: 'var(--text-muted)', fontSize: '1em'}}>Dernière mise à jour : 2024</span>
          </div>
        </div>
        <hr style={{border: 'none', borderTop: '1.5px solid var(--border-light)', margin: '1.5em 0'}} />
        <section style={{marginBottom: '1.5em'}}>
          <h2>1. Éditeur du site</h2>
          <p>Adel Computer<br />Adresse : Béjaïa, Algérie<br />Email : contact@adelcomputer.com</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>2. Hébergement</h2>
          <p>Le site est hébergé par :<br />Vercel Inc.<br />San Francisco, CA, USA</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>3. Propriété intellectuelle</h2>
          <p>Tous les contenus présents sur ce site sont la propriété exclusive d’Adel Computer.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>4. Données personnelles</h2>
          <p>Les informations collectées sont traitées conformément à notre politique de confidentialité.</p>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>5. Contact</h2>
          <p>Pour toute question, contactez-nous à : <a href="mailto:contact@adelcomputer.com">contact@adelcomputer.com</a></p>
        </section>
      </div>
    </div>
  </div>
);

export default LegalNotice; 