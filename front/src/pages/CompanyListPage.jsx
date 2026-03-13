import React from 'react';
import { Link } from 'react-router-dom';

// --- Real Multinational Corporation (MNC) Data with Highly Reliable Logo Links ---
// Note: These URLs point to image hosts that are generally more stable and less prone to SVG/CORS issues.
const companyList = [
  // Retail & E-commerce
  { id: 1, name: 'Walmart', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/walmart-285601.png', link: '/company/walmart' },
  { id: 3, name: 'IKEA', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/ikea-283084.png', link: '/company/ikea' },
  
  // Food & Beverage
  { id: 4, name: 'Pepsi', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/pepsi-282496.png', link: '/company/pepsi' },
  { id: 5, name: 'Starbucks', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/starbucks-282361.png', link: '/company/starbucks' },

  // Automotive/Industrial
  { id: 6, name: 'Mercedes-Benz', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/mercedes-benz-555524.png', link: '/company/mercedes' },
  { id: 7, name: 'Shell', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/shell-283031.png', link: '/company/shell' },
  { id: 8, name: 'Caterpillar', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/caterpillar-5-282649.png', link: '/company/caterpillar' },

  // Telecom & Media
  { id: 9, name: 'Verizon', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/verizon-282276.png', link: '/company/verizon' },
  { id: 10, name: 'CNN', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/cnn-283038.png', link: '/company/cnn' },

  // Finance & Services
  { id: 11, name: 'Mastercard', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/mastercard-283089.png', link: '/company/mastercard' },
  { id: 12, name: 'HSBC', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/hsbc-282479.png', link: '/company/hsbc' },
  
  // Aerospace & Logistics
  { id: 13, name: 'Boeing', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/boeing-282498.png', link: '/company/boeing' },
  { id: 14, name: 'UPS', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/ups-282379.png', link: '/company/ups' },
  { id: 15, name: 'DHL', logoUrl: 'https://cdn.iconscout.com/icon/free/png-256/dhl-282195.png', link: '/company/dhl' },
];

// --- Custom CSS for the Company List Page (Light Mode) ---
const pageStyles = `
  .company-list-page {
    padding: 3rem 0;
    font-family: 'Inter', sans-serif;
    color: #1f2937;
    background-color: #ffffff; 
    min-height: 100vh;
  }
  .company-card {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 2rem;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .company-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
  .company-logo {
    max-width: 100%;
    height: auto;
    max-height: 80px; /* INCREASED LOGO SIZE from 40px to 80px */
    margin-bottom: 1rem;
    object-fit: contain;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1)); 
  }
  .company-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0c1a2e;
    text-decoration: none;
    display: block;
    margin-top: 0.5rem;
  }
  .company-name:hover {
    color: #4ade80;
  }
  .page-title {
    color: #0c1a2e;
    font-weight: 900;
  }
`;

const CompanyListPage = () => {
  return (
    <div className="company-list-page container">
      <style>{pageStyles}</style>
      <h1 className="text-center mb-5 page-title">Our Global Partners 🌍</h1>
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {companyList.map((company) => (
          <div className="col" key={company.id}>
            <div className="company-card">
              <Link to={company.link}>
                <img 
                  src={company.logoUrl} 
                  alt={`${company.name} Logo`} 
                  className="company-logo"
                />
              </Link>
              <Link to={company.link} className="company-name">
                {company.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyListPage;