import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FaHome, FaBook, FaNewspaper, FaUserAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-harry">
      <Container fluid>
        <Row>
          <Col className="text-center py-3">
            <p>HARRY WIESE &copy; {currentYear}</p>
            <div className="d-flex justify-content-center flex-wrap">
              <Link as={Link} to="/" className="d-flex align-items-center me-3">
                <FaHome size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Gym Tracker</span>
              </Link>

              <Link
                as={Link}
                to="/books"
                className="d-flex align-items-center me-3"
              >
                <FaBook size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Treinos</span>
              </Link>

              <Link as={Link} to="/blogs" className="d-flex align-items-center">
                <FaNewspaper size={27} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Blog</span>
              </Link>

              <Link
                as={Link}
                to="/biography"
                className="d-flex align-items-center icon-bio-footer"
              >
                <FaUserAlt size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Sobre a GT</span>
              </Link>

              <div className="footer-top-container">
                <a href="#top">
                  <FaArrowUp />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
