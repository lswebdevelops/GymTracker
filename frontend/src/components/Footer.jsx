import { Container, Row,Nav, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FaHome,FaWeightHanging,FaDumbbell, FaNewspaper, FaUserAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <footer className="footer-harry">
      <Container fluid>
        <Row>
          <Col className="text-center py-3">
            <p>Gym Tracker &copy; {currentYear}</p>
            <div className="d-flex justify-content-center flex-wrap">
              <Link as={Link} to="/" className="d-flex align-items-center me-3">
                <FaHome size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Gym Tracker</span>
              </Link>

              <Link
                as={Link}
                to="/trainingTypes"
                className="d-flex align-items-center me-3"
              >
                <FaWeightHanging size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Treinos</span>
              </Link>
              {userInfo && (
              <Nav.Link
                as={Link}
                to="/myWorkout"
                className="d-flex align-items-center me-3"
              >
                <FaDumbbell size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Meu Treino</span>
              </Nav.Link>
            )}
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
