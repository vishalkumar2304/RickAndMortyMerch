import React from 'react';
import axios from 'axios';
import { Formik, Field, Form } from "formik"

import Listing from "./components/listing";
const pageCap = 5;
let prevP=null,nextP=null;

const Home = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [pageNum, setPageNum] = React.useState(0);
  const [pageContent, setPageContent] = React.useState(null);

  React.useEffect(()=>{
    if(searchResults && searchResults.length>0){
      let calc = pageNum*pageContent.length;
      setPageContent(searchResults.slice(calc, pageCap+calc))
    }
  },[searchResults,pageNum])

  const handleBtnClick = increment => {
    setPageNum(pageNum + increment);
  }

  const pageChangeHandler = (url, next) => {
    setPageContent([])
    axios.get(url).then((data)=>{
      if(data && data.data && data.data.info && data.data.info.count>0){
        if(next){
          setPageNum(0)
        }
        else{
          setPageNum(Math.ceil(data.data.results.length/pageCap)-1)
        }
        setSearchResults(data.data.results)
        nextP = data.data.info.next;
        prevP = data.data.info.prev;
      }
    })
  }

  return (
    <div className="container-wrapper">
    <Formik
      initialValues={{
        searchText: ""
    }}
      onSubmit={(values) => {
        setPageContent([])
        setPageNum(0)
        axios.get(`https://rickandmortyapi.com/api/character/?name=${values.searchText}`).then((data)=>{
          if(data && data.data && data.data.info && data.data.info.count>0){
            setSearchResults(data.data.results)
            nextP = data.data.info.next;
            prevP = data.data.info.prev;
          }
        })
      }}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, values }) => {
        return (
          <Form name="search">
          <Field
            type="input"
            name="searchText"
            placeholder="Search for merchandise"
          />
          <button type="submit">Search</button>
              </Form>
        )}}</Formik>
        {pageContent && pageContent.length>0 && <div className="listing-container">
        {pageContent.map((res, ind)=>{
          return(
            res ? <Listing keyInd={`search_res_${ind}`} name={res.name} image={res.image} seen={res.location} episodes={res.episode.length} charId={res.id}/> : null
          )
        })}
        <div className="pagination-container">
            {pageNum > 0
            ?
            <div className="pagination-btn prev" onClick={()=>{handleBtnClick(-1)}}>Prev</div>
            :
            (prevP ? <div className="pagination-btn prev" onClick={()=>{pageChangeHandler(prevP)}}>Prev</div> : "")
            }
            {(pageCap*pageNum)+pageContent.length < searchResults.length
            ?
            <div className="pagination-btn next" onClick={()=>{handleBtnClick(1)}}>Next</div>
            :
            (nextP ? <div className="pagination-btn next" onClick={()=>{pageChangeHandler(nextP, true)}}>Next</div> : "")
            }
        </div>
      </div>}
    </div>
  );
}

export default Home;
