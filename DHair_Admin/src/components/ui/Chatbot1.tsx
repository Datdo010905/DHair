import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import AdminIcon from './AdminIcon';

const Chatbot1 = () => (
  <div id="chatbot">
    <Link
      to="/home#hair-advisor"
      aria-label="Mở DHair AI tư vấn kiểu tóc"
      title="DHair AI · Tư vấn kiểu tóc"
    >
      <AdminIcon icon={FiMessageCircle} aria-hidden="true" />
    </Link>
  </div>
);

export default Chatbot1;
