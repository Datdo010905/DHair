import Product from '../../components/ui/Product';
import Datlich from '../../components/ui/DatLich';
import Slideshow from '../../components/ui/Slideshow';
import '../../assets/css/home-content.css';

const HomePage = () => {
  return (
    <div id="container" className="dh-home-content">
      <Slideshow />
      <div className="clear"></div>

      <Datlich />
      <div className="clear"></div>

      <Product />
    </div>
  );
};

export default HomePage;
