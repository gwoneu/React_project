import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink, useNavigate} from 'react-router-dom'
import { BoxContext } from './BoxContext';
const HeaderPage = () => {
    const {box, setBox} = useContext(BoxContext);
    const navi = useNavigate();
    const onLogout = (e) => {
        e.preventDefault();
        /*
        if(window.confirm("로그아웃 하시겠습니까?")) {
            sessionStorage.clear();
            navi("/");
        }
        */
        setBox({
            show:true,
            message:"로그아웃 하시겠습니까?",
            action: () => {
                sessionStorage.clear();
                navi("/");
            }
        });
    }

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container fluid>
                <NavLink to="/" className="home">LOGO</NavLink>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0 nav_link" style={{ maxHeight: '100px' }} navbarScroll>
                        <NavLink to="/">Home</NavLink>
                        {sessionStorage.getItem("uid") === "admin" &&
                            <>
                                <NavLink to="/books/search">도서검색</NavLink>
                                <NavLink to="/books/list">도서목록</NavLink>
                                <NavLink to="/orders/admin">주문관리</NavLink>
                            </>
                        }
                        {(sessionStorage.getItem("uid") && sessionStorage.getItem("uid") != 'admin') &&
                            <>
                                <NavLink to="/orders/cart">장바구니</NavLink>
                                <NavLink to="/orders/list">주문목록</NavLink>
                            </>
                        }
                    </Nav>
                    <Nav>
                        {!sessionStorage.getItem("uid") ?
                            <NavLink to="/users/login">로그인</NavLink>
                            :
                            <>
                                <NavLink to="/users/mypage">{sessionStorage.getItem("uid")}</NavLink>
                                <NavLink onClick={onLogout} to="/users/login">로그아웃</NavLink>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeaderPage