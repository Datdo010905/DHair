import { Link } from 'react-router-dom';
const LogoForm = () => {
  return (
    <div className="login-left">
      <Link to="/">
        <img src="/img/logoDHair_V1.png" alt="DHAIR Logo" className="logo" />
      </Link>
      <h2>DHair - Cắt tóc theo style của bạn!</h2>
    </div>
  );
};

export default LogoForm;
