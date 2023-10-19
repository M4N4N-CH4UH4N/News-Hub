// import React, { useEffect, useState } from 'react'
// import Newsblock from './Newsblock';
// import PropTypes from 'prop-types'


// export default function News(props) {
//     const [articles, setArticles] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalResults, settotalResults] =useState(0); 

//     // const [loading, setLoading] = useState(true)
//   //  async function componentDidMount() {
//   //       const url ="https://newsapi.org/v2/top-headlines?country=us&apiKey=95ab9380989842c7b97ee42c550fe31c";
//   //       let data = await fetch(url);
//   //       let parseddata =await data.json();
//   //       console.log(parseddata);

//   //        setArticles(parseddata.articles);

//   //    }componentDidMount();
//   //  const API = 'https://jsonplaceholder.typicode.com/posts';
//    const API = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=95ab9380989842c7b97ee42c550fe31c';
//   const fetchdata = () => {
//     fetch(API)
//       .then((res) => res.json())
//       .then((res) => {
//         console.log(res)
//         setArticles(res.articles)
//         settotalResults(res.totalResults)
//       })
//   }
//   useEffect(() => {
//     fetchdata()
//   }, [])

//   const handlePrevClick= async ()=>{
//     setPage(page-1);
//     const API = `https://newsapi.org/v2/top-headlines?country=us&page=${page}&apiKey=95ab9380989842c7b97ee42c550fe31c&pageSize=${props.pageSize}`;
//     fetchdata()
//         console.log("previous");

//   }
//  const handleNextClick= async ()=>{
//   if(page +1 > Math.ceil(totalResults/10)){

//   }else{
//     setPage(page+1);
//     const API = `https://newsapi.org/v2/top-headlines?country=us&page=${page}&apiKey=95ab9380989842c7b97ee42c550fe31c&pageSize=${props.pageSize}`;
//     fetchdata()
   
//     console.log("next");

//   }}
//   return (
//     <div className='container my-3'>
//     <h1>NewsMonkey - Top  Headlines</h1>
//     <div className='row'>
//     {articles.map((elements) =>{
//       return <div className='col md-4'>
//         <Newsblock title={elements.title?elements.title:""} description={elements.description?elements.description:""} url={elements.url} urlToImage={elements.urlToImage} />
        
//         </div>
//     })}
       
//         </div>
//       <div className='container d-flex justify-content-between'>
//       <button disabled={page<=1} type="button" className="btn btn-dark" onClick={handlePrevClick}> &larr; Previous</button>
//       <button type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
//       </div>
        
        
//     </div>
//   )
// }
// News.defaultProps = {
//   country: 'in',
//   pageSize: 8,
//   category: 'general',
// }

// News.propTypes = {
//   country: PropTypes.string,
//   pageSize: PropTypes.number,
//   category: PropTypes.string,
// }
import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'

import PropTypes from 'prop-types'
import Spinn from './Spinn'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=95ab9380989842c7b97ee42c550fe31c&page=${page}&pageSize=${props.pageSize}`; 
        setLoading(true)
      
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - News Hub`;
        updateNews(); 
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {   
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=95ab9380989842c7b97ee42c550fe31c&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1) 
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        console.log(articles)
        
        setTotalResults(parsedData.totalResults)
        console.log(totalResults)
      }
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinn/>}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinn/>}
                    
                 >  
                    <div className="container">
                         
                    <div className="row">
                        {articles && articles.map((element) => {
                          console.log(element)
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>

                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
    }


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
