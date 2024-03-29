import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import ImageModal from './ImageModal';

const ImageSearch = () => {
    const [box, setBox] = useState({
        show:false,
        url:''
    });
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [total, setTotal] = useState(0);
    const [end, setEnd] = useState(false);
    const [cnt, setCnt] = useState(0);

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const page = parseInt(search.get("page") ? search.get("page") : 1);
    const [query, setQuery] = useState(search.get("query") ? search.get("query") : "태연"); //있으면 query값 : 없으면 초기값으로 설정한 '초기값'을 가져온다.
    //console.log(page,query);
    
    const getImages = async () => { //에이싱크 await이랑 같이 사용
        const url = `https://dapi.kakao.com/v2/search/image?page=${page}&query=${query}&size=12`;
        const config = {
            headers: {"Authorization":"KakaoAK b9e7c3ac23fcce51a89eeebcbaf568f1"}
        }
        setLoading(true);
        const res = await axios(url, config);
        let data = res.data.documents;
        //console.log(data);
        setTotal(res.data.meta.pageable_count);
        setEnd(res.data.meta.is_end);
        data = data.map(img=>img && {...img, checked:false});
        setImages(data);
        setLoading(false);
    }

    const onChangeAll = (e) => {
        const data = images.map(img=>img && {...img, checked:e.target.checked});
        setImages(data);
    }

    const onChangeSingle = (e, url) => {
        const data = images.map(img=>img.thumbnail_url===url? {...img, checked:e.target.checked} : img);
        setImages(data);
    }

    useEffect(()=>{
        getImages();
    },[location]);

    useEffect(()=>{
        let cnt = 0;
        images.forEach(img=>img.checked && cnt++);
        setCnt(cnt);
    }, [images])

    const onSumit=(e)=>{
        e.preventDefault();
        if(query==""){
            alert("검색어를 입력하세요");
        }else{
            navigate(`/image?query=${query}&page=1`)
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>이미지검색</h1>
            {loading ? 
                <div>로딩중...</div>
                :
                <>
                    <Row>
                        <Col col={1}><input checked={images.length === cnt} type="checkbox" onChange={onChangeAll}/></Col>
                        <Col>
                            <form onSubmit={onSumit}>
                                <InputGroup>
                                    <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                                    <Button type='sumbit'>검색</Button>
                                </InputGroup>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='text-end'>검색수 : {total}건</Col>
                    </Row>
                    <hr/>
                    <Row>
                        {images.map(img=>
                            <Col lg={2} md={3} sm={4} key={img.thumbnail_url} className='mb-3'>
                                <Card className='p-3'>
                                    <input onChange={(e)=>onChangeSingle(e, img.thumbnail_url)} className='mb-3' type='checkbox' checked={img.checked}/>
                                    <img onClick={()=>setBox({url:img.image_url, show:true})} src={img.thumbnail_url} width="100%" style={{cursor:'pointer'}}/>
                                </Card>
                            </Col>
                        )}
                    </Row>
                    <div className='text-center'>
                        <Button onClick={()=>navigate(`/image?query=${query}&page=${page-1}`)} variant="dark" disabled={page===1}>이전</Button>
                        <span className='mx-3'> {page} / {Math.ceil(total/12)} </span>
                        <Button onClick={()=>navigate(`/image?query=${query}&page=${page+1}`)} variant="dark" disabled={end}>다음</Button>
                    </div>
                    <ImageModal box={box} setBox={setBox}/>
                </>
            }
        </div>
    )
}

export default ImageSearch