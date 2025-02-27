import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Logo = ({ className = '' }) => (
  <Link to="/" className={`text-2xl font-bold text-white ${className}`}>
    BestBuy4uBD
  </Link>
);

Logo.propTypes = {
  className: PropTypes.string
};

export default Logo; 