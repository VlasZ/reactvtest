import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBookmark, faSearch, faScroll} from "@fortawesome/free-solid-svg-icons";
import {faNewspaper} from "@fortawesome/free-solid-svg-icons";
import {faAddressCard} from "@fortawesome/free-solid-svg-icons";
import {
    BrowserRouter as Router,
    Route,
    Link, Routes, useParams, Navigate, HashRouter,
} from 'react-router-dom';



export const Navbar = () => (
            <HashRouter>
                <header className="mainMenu">
                    <nav>
                                <Link className="menuLink" to="/news"><FontAwesomeIcon icon={faNewspaper}/> Новости</Link>
                                <Link className="menuLink" to="/about"><FontAwesomeIcon icon={faAddressCard}/> О приложении</Link>
                                <Link className="menuLink" to="/bookmarks"><FontAwesomeIcon icon={faBookmark}/> Закладки</Link>
                  </nav>
                </header>

                <main>
                    <Routes>
                        <Route path="*" element={<PageNotFound />}>
                        </Route>
                        <Route exact path="/ppireact" element={<News />}>
                        </Route>
                        <Route path="/about" element={<About />}>
                        </Route>
                        <Route path="/news" element={<News />}>
                        </Route>
                        <Route path="/news/:id" element={<New />}>
                        </Route>
                        <Route path="/:" element={<News />}>
                        </Route>
                        <Route exact path="/" element={<News />}>
                        </Route>
                        <Route path="/bookmarks" element={<Bookmarks />}>
                        </Route>
                    </Routes>
                </main>
            </HashRouter>
)

    export function About() {
        return(
            <div className="about">
                <ul id="listAbout">
                    <li><p>Одностраничное веб-приложение, для просмотра новостей космической тематики, на основе React</p></li>
                    <li><p>В процессе использовались языки: JavaScript, CSS, HTML</p></li>
                    <li><p>Выполнил студент группы РПИС-92, Акифьев Владислав</p></li>
                </ul>
            </div>

        );
    }
    export function PageNotFound(){
    return(
        <div>
            <h1>404</h1>
            <h2>Вы попали на несуществующую ссылку, пожалуйста вернитесь на <Link to={"/"}>главную страницу</Link></h2>
        </div>
    );
    }


export function News() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [isFiltered, setFilter] = useState(null);
    const [textFilter, setTextFilter] = useState("");
    const [sort, setSort] = useState("");
    const [pageCount, setPageCount] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageArray, setPageArray] = useState([]);


    function countPages(count){
        setPageCount(Math.ceil(count/5));
        getPageArray(Math.ceil(count/5));
    }

    function getPageArray(num){

            if(num < 6){
            let temp=[];
            for (let i=0;i<=num-3;i++){
                temp[i]=i+2;
            }
            setPageArray(temp);
        }
        else if(pageNumber + 2 >=num){
            setPageArray([num-5,num-4,num-3,num-2,num-1]);
        }
        else if(pageNumber -2 <=1){
            setPageArray([2,3,4,5,6]);
        }
        else{
            setPageArray([pageNumber-2,pageNumber-1,pageNumber,pageNumber+1,pageNumber+2]);
        }
    }

    useEffect(() =>{
        fetchForPages();
        isFiltered ? fetchWithFilter() : fetchIt();
    }, [textFilter,sort,pageNumber])

    function fetchIt(){
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=5&_start="+(((pageNumber-1)*5)))
                .then(res => res.json())
                .then(
                    (result) => {
                        setItems(result);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }

    function fetchForPages(){
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=100&"+textFilter)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);
                        countPages(result.length);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }

    function fetchWithFilter(){
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=5&_start="+(((pageNumber-1)*5))+"&"+textFilter+"&"+sort)

                .then(res => res.json())
                .then(
                    (result) => {
                        setItems(result);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }
    function handleOnClickText(value){
        setFilter(true);
        setTextFilter(value);
    }

    function handleOnClickSort(value){
        setFilter(true);
        setSort(value);
    }

    function handlePageClick(value){
        setPageNumber(value);
        getPageArray(pageCount);
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <div>

                <div className="searchSmth">
                    <table>

                        <td><label>Поиск по заголовку</label>
                            <tr><input id='inputTitle' type="text" /><br /><button className="sortBtnText" onClick={()=>handleOnClickText("title_contains="+document.getElementById('inputTitle').value)}>Поиск</button></tr>
                        </td>

                        <td><label>Поиск по содержанию</label>
                            <tr><input id='inputSumm' type="text" /><br /><button className="sortBtnText" onClick={()=>handleOnClickText("summary_contains="+document.getElementById('inputSumm').value)}>Поиск</button></tr>
                        </td>
                    </table>
                    <br></br>
                    <table>
                        <tr>
                            <td><button className="sortBtn" onClick={()=>handleOnClickSort("_sort=publishedAt:desc")}>Сначала новые</button></td>
                            <td><button className="sortBtn" onClick={()=>handleOnClickSort("_sort=publishedAt:asc")}>Сначала старые</button></td>
                        </tr>
                    </table>
                </div>
                {
                    pageCount>1 ?
                        <div className="pageBar">
                            <button className={pageNumber === 1 ? 'pageBarBtnFsCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(1)}>1</button>
                            {pageArray.map(page => (
                                <button className={pageNumber === page ? 'pageBarBtnCurrent' : 'pageBarBtn'} onClick={()=>handlePageClick(page)}>{page.toString()}</button>
                            ))}
                            <button className={pageNumber === pageCount ? 'pageBarBtnCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(pageCount)}>{pageCount}</button>
                        </div>
                            : ""
                    }
                <hr className="hrSplit"/>
            <ul className="newsList">
                {items.map(item => (
                    <li key={item.id}>
                        <p id="newsTitle"><Link id="headerNews" to={"/news/"+item.id}>{item.title}</Link></p>
                        <p><img className="postImage" src={item.imageUrl}/></p>
                        <p>Дата публикации: {dateNews(item.publishedAt)}</p>
                        <hr className="hrSplitPost"/>
                    </li>
                ))}
            </ul>
                <hr className="hrSplit"/>
                {
                    pageCount>1 ?
                        <div className="pageBar">
                            <button className={pageNumber === 1 ? 'pageBarBtnFsCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(1)}>1</button>
                            {pageArray.map(page => (
                                <button className={pageNumber === page ? 'pageBarBtnCurrent' : 'pageBarBtn'} onClick={()=>handlePageClick(page)}>{page.toString()}</button>
                            ))}
                            <button className={pageNumber === pageCount ? 'pageBarBtnCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(pageCount)}>{pageCount}</button>
                        </div>
                        : ""
                }
            </div>
        );
    }
    function dateNews(date){
        let t = date.replace('T', ' ');
        let z = t.replace('Z', ' ');
        return z;
    }
}




export function New() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [item, setItems] = useState(null);
    const { id } = useParams();
    const [outputItems, setOutputItems] = useState([]);
    const [isBookmarked, setBookmarked] = useState(false);
    let query ="";
    let sameIt=[];


    function handleClickSave(id){
        localStorage.setItem((localStorage.length+1).toString(),id);
        setBookmarked(true);
        alert("Добавлено в закладки!");
    }

    function handleClickRemove(id){
        for(let i=0; i<localStorage.length;i++){
            let key=localStorage.key(i);
            if(localStorage.getItem(key)===id.toString()) {
                localStorage.removeItem(key);
                setBookmarked(false);
                alert("Закладка удалена!")
            }
        }
    }

    // Примечание: пустой массив зависимостей [] означает, что
    // этот useEffect будет запущен один раз
    // аналогично componentDidMount()
    useEffect(() => {
        fetch("https://api.spaceflightnewsapi.net/v3/articles/"+id)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                    sameIt = result.title.split(" ");
                    fetchSame();
                },
                // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                // чтобы не перехватывать исключения из ошибок в самих компонентах.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [id,isBookmarked])

    function fetchSame(){
        sameIt.forEach(element =>
            element.length>3 && element.toLowerCase()!=="space" ?
            query = query+"&title_contains="+element : ""
        );
        for(let i=0;i<localStorage.length;i++){
            let key=localStorage.key(i);
            if(localStorage.getItem(key)===id){
                setBookmarked(true);
                break;
            }
            else setBookmarked(false);
        }
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?"+query)
                .then(ress => ress.json())
                .then(
                    (results) => {
                        setIsLoaded(true);
                        setOutputItems(results);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                );
        }
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <div>
                <ul className="newsList">
                    <li key={item.id}>
                        <p id="newsTitle">{item.title} {!isBookmarked ?
                            <button className="bookmarkBtn" onClick={()=>handleClickSave(item.id)}><FontAwesomeIcon icon={faBookmark} />  В закладки</button>:
                            <button className="bookmarkBtn" onClick={()=>handleClickRemove(item.id)}><FontAwesomeIcon icon={faBookmark} />  Убрать из закладок</button>
                        }</p>
                        <p className="postUrl">Ссылка на источник: <a href={item.url}>{item.url}</a></p>
                        <p><img className="postInImage" src={item.imageUrl}/></p>
                        <p id="postSummary">{item.summary}</p>
                    </li>
                </ul>
                <hr/>
                <p/>
                <label id="sameNewsLbl"><FontAwesomeIcon icon={faNewspaper}/> Похожие статьи:</label>
                <p/>
                <hr/>
                  <div>
                      <ul className="newsList">
                          {outputItems.map(itemS => (item.id!==itemS.id ?
                              <li key={itemS.id}>
                                  <p id="newsTitle"><Link id="headerNews" to={"/news/"+itemS.id}>{itemS.title}</Link></p>
                                  <p><img className="postImage" src={itemS.imageUrl}/></p>
                                  <p>Дата публикации: {item.publishedAt}</p>
                              </li>
                          :""))}
                      </ul>
                  </div>
            </div>
        );
    }
}

export function Bookmarks(){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [pageCount, setPageCount] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageArray, setPageArray] = useState([]);

    function countPages(count){
        setPageCount(Math.ceil(count/5));
        getPageArray(Math.ceil(count/5));
    }

    function getPageArray(num){
     if(num < 6){
            let temp=[];
            for (let i=0;i<=num-3;i++){
                temp[i]=i+2;
            }
            setPageArray(temp);
        }
        else if(pageNumber + 2 >=num){
            setPageArray([num-5,num-4,num-3,num-2,num-1]);
        }
        else{
            setPageArray([pageNumber-2,pageNumber-1,pageNumber,pageNumber+1,pageNumber+2]);
        }
    }

    function handlePageClick(value){
        setPageNumber(value);
        getPageArray(pageCount);
    }

    useEffect(() => {
        fetchForPages();
        fetchIt()
    }, [pageNumber])

    function fetchForPages(){
        let query="";
        for(let i=0; i<localStorage.length;i++){
            let key = localStorage.key(i);
            query=query+"&id="+localStorage.getItem(key);
        }
        if(localStorage.length!==0)
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?"+query)
                .then(res => res.json())
                .then(
                    (result) => {
                        countPages(result.length);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }
    function fetchIt(){
        let query="";
        for(let i=0; i<localStorage.length;i++){
                let key = localStorage.key(i);
                query=query+"&id="+localStorage.getItem(key);
        }
        if(localStorage.length!==0)
        {
            fetch("https://api.spaceflightnewsapi.net/v3/articles?_limit=5&_start="+(((pageNumber-1)*5))+query)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);
                        setItems(result);
                    },
                    // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
                    // чтобы не перехватывать исключения из ошибок в самих компонентах.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }
    }
    if(localStorage.length!==0){
        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Загрузка...</div>;
        } else {
            return (
                <div>
                    <span className="myBookmarks">Мои закладки:</span>
                    <hr className="hrSplit"/>
                    {
                        items.length!==0 && pageCount>1 ?
                            <div className="pageBar">
                                <button className={pageNumber === 1 ? 'pageBarBtnFsCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(1)}>1</button>
                                {pageArray.map(page => (
                                    <button className={pageNumber === page ? 'pageBarBtnCurrent' : 'pageBarBtn'} onClick={()=>handlePageClick(page)}>{page.toString()}</button>
                                ))}
                                <button className={pageNumber === pageCount ? 'pageBarBtnFsCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(pageCount)}>{pageCount}</button>
                            </div>
                            : ""
                    }
                    <hr className="hrSplit"/>
                    <ul className="newsList">

                        {items.length!==0 ? items.map(item => (
                                <li key={item.id}>
                                    <p id="newsTitle"><Link id="headerNews" to={"/news/"+item.id}>{item.title}</Link></p>
                                    <p><img className="postImage" src={item.imageUrl}/></p>
                                </li>
                            )) :
                            <div>
                                <h1>У вас нет добавленных закладок!</h1>
                            </div>}
                    </ul>
                    <hr className="hrSplit"/>
                    {
                        items.length!==0 && pageCount>1 ?
                            <div className="pageBar">
                                <button className={pageNumber === 1 ? 'pageBarBtnFsCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(1)}>1</button>
                                {pageArray.map(page => (
                                    <button className={pageNumber === page ? 'pageBarBtnCurrent' : 'pageBarBtn'} onClick={()=>handlePageClick(page)}>{page.toString()}</button>
                                ))}
                                <button className={pageNumber === pageCount ? 'pageBarBtnCurrent' : 'pageBarBtnFs'} onClick={()=>handlePageClick(pageCount)}>{pageCount}</button>
                            </div>
                            : ""
                    }
                </div>
            );
        }
    }
    else{
        return (
            <div>
                <ul className="newsList">

                    {items.length!==0 ? items.map(item => (
                            <li key={item.id}>
                                <p id="newsTitle"><Link id="headerNews" to={"/news/"+item.id}>{item.title}</Link></p>
                                <p><img className="postImage" src={item.imageUrl}/></p>
                            </li>
                        ))
                        :
                        <div>
                            <h1>У вас нет добавленных закладок!</h1>
                        </div>}
                </ul>
                {
                    items.length!==0 ?
                        <div>
                            <button onClick={()=>handlePageClick(1)}>1</button>
                            {pageArray.map(page => (
                                <button onClick={()=>handlePageClick(page)}>{page.toString()}</button>
                            ))}
                            {
                                pageCount!==1 ?
                                    <button onClick={()=>handlePageClick(pageCount)}>{pageCount}</button>
                                    : ""
                            }
                        </div>
                        : ""
                }
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Navbar />);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
