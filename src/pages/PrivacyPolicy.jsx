import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => (
  <div style={{background: 'var(--bg-tertiary)', minHeight: '100vh', padding: '3em 0'}}>
    <div className="container">
      <div className="card privacy-policy-card" style={{maxWidth: 700, margin: '0 auto', padding: '2.5em 2em', boxShadow: '0 8px 32px rgba(37,99,235,0.10)', animation: 'fadeInUp 0.7s'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1.5em'}}>
          <FaShieldAlt size={36} style={{color: 'var(--accent-primary)'}} />
          <div>
            <h1 style={{margin: 0}}>Politique de confidentialité</h1>
            <span style={{color: 'var(--text-muted)', fontSize: '1em'}}>Dernière mise à jour : 2024</span>
          </div>
        </div>
        <hr style={{border: 'none', borderTop: '1.5px solid var(--border-light)', margin: '1.5em 0'}} />
        <section style={{marginBottom: '1.5em'}}>
          <h2>1. Introduction</h2>
          <p>Chez Adel Computer, nous accordons une grande importance à la confidentialité de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les informations nécessaires à la gestion de vos commandes et à l'amélioration de nos services (nom, email, téléphone, adresse, etc.).</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>3. Utilisation des données</h2>
          <p>Vos données sont utilisées uniquement pour traiter vos commandes, vous contacter, et améliorer votre expérience sur notre site. Elles ne sont jamais revendues à des tiers.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>4. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations contre tout accès non autorisé.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>5. Vos droits</h2>
          <p>Vous pouvez demander la modification ou la suppression de vos données à tout moment en nous contactant.</p>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>6. Contact</h2>
          <p>Pour toute question concernant la confidentialité, contactez-nous à : <a href="mailto:contact@adelcomputer.com">contact@adelcomputer.com</a></p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy; 