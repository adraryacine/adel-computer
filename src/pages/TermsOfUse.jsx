import React from 'react';
import { FaFileContract } from 'react-icons/fa';

const TermsOfUse = () => (
  <div style={{background: 'var(--bg-tertiary)', minHeight: '100vh', padding: '3em 0'}}>
    <div className="container">
      <div className="card terms-of-use-card" style={{maxWidth: 700, margin: '0 auto', padding: '2.5em 2em', boxShadow: '0 8px 32px rgba(37,99,235,0.10)', animation: 'fadeInUp 0.7s'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '1.5em'}}>
          <FaFileContract size={36} style={{color: 'var(--accent-primary)'}} />
          <div>
            <h1 style={{margin: 0}}>Conditions d’utilisation</h1>
            <span style={{color: 'var(--text-muted)', fontSize: '1em'}}>Dernière mise à jour : 2024</span>
          </div>
        </div>
        <hr style={{border: 'none', borderTop: '1.5px solid var(--border-light)', margin: '1.5em 0'}} />
        <section style={{marginBottom: '1.5em'}}>
          <h2>1. Acceptation des conditions</h2>
          <p>En utilisant ce site, vous acceptez les présentes conditions d’utilisation. Si vous n’êtes pas d’accord, veuillez ne pas utiliser le site.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>2. Utilisation du site</h2>
          <p>Le site est destiné à un usage personnel et non commercial. Toute utilisation abusive ou frauduleuse est interdite.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>3. Propriété intellectuelle</h2>
          <p>Tous les contenus (textes, images, logos) sont la propriété d’Adel Computer et ne peuvent être reproduits sans autorisation.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>4. Limitation de responsabilité</h2>
          <p>Adel Computer ne saurait être tenu responsable des dommages directs ou indirects liés à l’utilisation du site.</p>
        </section>
        <hr className="section-divider" />
        <section style={{marginBottom: '1.5em'}}>
          <h2>5. Modification des conditions</h2>
          <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur cette page.</p>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>6. Contact</h2>
          <p>Pour toute question, contactez-nous à : <a href="mailto:contact@adelcomputer.com">contact@adelcomputer.com</a></p>
        </section>
      </div>
    </div>
  </div>
);

export default TermsOfUse; 