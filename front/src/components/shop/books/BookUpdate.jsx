import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { InputGroup, Spinner, Form, Col, Row, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { BoxContext } from '../BoxContext';

const BookUpdate = () => {
    const {box, setBox} = useContext(BoxContext);
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const {bid} = useParams();
    const [book, setBook] = useState({
        bid:'',
        title:'',
        price:'',
        fmtprice:'',
        authors:'',
        contents:'',
        publisher:'',
        image:'',
        isbn:'',
        regdate:'',
        fmtdate:''
    });
    const {title, price, fmtprice, authors, contents, publisher, image, isbn, regdate, fmtdate} = book; //bid는 위에 useParams로 할당

    const getBook = async () => {
        setLoading(true);
        const res = await axios.get('/books/read/' + bid);
        //console.log(res.data);
        setBook(res.data);
        setLoading(false);
    }

    useEffect(()=>{
        getBook();
    },[]);

    const onChange = (e) => {
        setBook({
            ...book,
            [e.target.name]:e.target.value
        });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        /*
        if(window.confirm("수정한 내용을 저장하시겠습니까?")){
            //수정하기
            const res = await axios.post('/books/update', book);
            if(res.data === 0){
                alert("수정 실패");
            }else{
                alert("수정 완료");
                navi(`/books/read/${bid}`);
            }
        }
        */
        setBox({
            show:true,
            message:"수정한 내용을 저장하시겠습니까?",
            action:async ()=>{
                const res = await axios.post('/books/update', book);
                if(res.data === 0){
                    //alert("수정 실패");
                    setBox({show:true, message:"수정 실패"});
                }else{
                    //alert("수정 완료");
                    setBox({show:true, message:"수정 완료"});
                    navi(`/books/read/${bid}`);
                }
            }
        });
    }

    if(loading) return <div className='text-center my-5'><Spinner variant='dark'/></div>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서정보수정</h1>
            <Row className='justify-content-center'>
                <Col md={8}>
                    <Card className='p-3'>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서코드</InputGroup.Text>
                                <Form.Control value={bid} name='bid' readOnly/> 
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서제목</InputGroup.Text>
                                <Form.Control onChange={onChange} value={title} name='title'/>
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서가격</InputGroup.Text>
                                <Form.Control onChange={onChange} value={price} name='price'/>
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroup.Text>도서저자</InputGroup.Text>
                                <Form.Control onChange={onChange} value={authors} name='authors'/>
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroup.Text>출판사</InputGroup.Text>
                                <Form.Control onChange={onChange} value={publisher} name='publisher'/>
                            </InputGroup>

                            <Form.Control onChange={onChange} as="textarea" name='contents' rows={10}>{contents}</Form.Control>

                            <div className='text-center my-3'>
                                <Button type='submit' className="me-2" variant="dark">수정</Button>
                                <Button variant="outline-dark" onClick={()=> getBook()}>취소</Button>
                            </div>
                            
                        </form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default BookUpdate