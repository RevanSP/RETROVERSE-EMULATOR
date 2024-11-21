import React from 'react';

const socialMediaLinks = [
  {
    href: 'https://github.com/RevanSP',
    iconClass: 'fab fa-github',
  },
  {
    href: 'https://www.facebook.com/profile.php?id=100082958149027',
    iconClass: 'fab fa-facebook',
  },
  {
    href: 'https://instagram.com/m9nokuro',
    iconClass: 'fab fa-instagram',
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-light-mode text-dark-mode py-3 mt-auto shadow">
      <div className="container text-center">
        <p className="mb-0">
          Made By{' '}
          <a href="https://itsme-lol.vercel.app" className="text-secondary">
            ReiivanTheOnlyOne
          </a>
        </p>
        <div className="mt-2">
          <a
            href={socialMediaLinks[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-links"
          >
            {socialMediaLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <i className={link.iconClass}></i>
              </a>
            ))}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
