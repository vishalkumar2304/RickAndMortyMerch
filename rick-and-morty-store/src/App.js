import React from 'react';
import { get } from './utils/common';
import { Formik, Field, Form } from "formik";
import "./App.css";

import Loader from "./components/loader";
import Listing from "./components/listing";
import Detail from "./components/detail";

const pageCap = 5;
let prevP = null, nextP = null;

const Home = () => {
  const [searchResults, setSearchResults] = React.useState(null);
  const [pageNum, setPageNum] = React.useState(0);
  const [pageContent, setPageContent] = React.useState(null);
  const [showDetail, toggleDetail] = React.useState(null);
  const [clearSearchBtnShow, toggleClearSearchBtn] = React.useState(false);
  const [loaderShow, toggleLoader] = React.useState(false);

  React.useEffect(() => {
    document.title = "Rick and Morty merch store";
  }, [0])

  React.useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      let calc = pageNum * pageContent.length;
      setPageContent(searchResults.slice(calc, pageCap + calc))
    }
  }, [searchResults, pageNum])

  const fetchData = (url) => {
    toggleLoader(true)
    return new Promise((resolve, reject) => {
      get(url).then((data) => {
        if (data && data.data && data.data.info && data.data.info.count > 0) {
          toggleLoader(false)
          resolve(data.data)
        }
      }, (err) => {
        toggleLoader(false)
        reject(err)
      })
    })
  }

  const handleBtnClick = increment => {
    setPageNum(pageNum + increment);
  }

  const pageChangeHandler = (url, next) => {
    setPageContent([])
    fetchData(url).then((data) => {
      toggleClearSearchBtn(true)
      if (next) {
        setPageNum(0)
      }
      else {
        setPageNum(Math.ceil(data.results.length / pageCap) - 1)
      }
      setSearchResults(data.results)
      nextP = data.info.next;
      prevP = data.info.prev;
    })
  }

  const getDetails = charId => {
    toggleDetail(charId)
  }

  const closeDetail = () => {
    toggleDetail(null)
  }

  const clearSearch = () => {
    toggleClearSearchBtn(false);
    setPageContent([])
    setPageNum(0)
    fetchData(`https://rickandmortyapi.com/api/character/`).then((data) => {
      setSearchResults(data.results)
      nextP = data.info.next;
      prevP = data.info.prev;
    })
  }

  return (
    <div className="container-wrapper">
      {loaderShow && <Loader isLoader={loaderShow} />}
      {showDetail && <Detail closeDetail={closeDetail} charId={showDetail} />}
      <div className={`${showDetail ? "blur " : ""}searc-form-wrapper`}>
        <Formik
          initialValues={{
            searchText: ""
          }}
          onSubmit={(values) => {
            setPageContent([])
            setPageNum(0)
            values.searchText != "" && fetchData(`https://rickandmortyapi.com/api/character/?name=${values.searchText}`).then((data) => {
              toggleClearSearchBtn(true)
              setSearchResults(data.results)
              nextP = data.info.next;
              prevP = data.info.prev;
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
            )
          }}
        </Formik>
        {clearSearchBtnShow && <span className="clear-search show-all" onClick={() => { clearSearch() }}>Clear Filter</span>}
        {pageContent && pageContent.length > 0 && <div className="listing-container">
          {pageContent.map((res, ind) => {
            return (
              res ? <Listing getDetails={getDetails} key={`key_prop_search_${ind}`} keyInd={`search_res_${ind}`} name={res.name} image={res.image} seen={res.location} episodes={res.episode.length} charId={res.id} /> : null
            )
          })}
          <div className="pagination-container">
            {pageNum > 0
              ?
              <div className="pagination-btn prev" onClick={() => { handleBtnClick(-1) }}>Prev</div>
              :
              (prevP ? <div className="pagination-btn prev" onClick={() => { pageChangeHandler(prevP) }}>Prev</div> : "")
            }
            {(pageCap * pageNum) + pageContent.length < searchResults.length
              ?
              <div className="pagination-btn next" onClick={() => { handleBtnClick(1) }}>Next</div>
              :
              (nextP ? <div className="pagination-btn next" onClick={() => { pageChangeHandler(nextP, true) }}>Next</div> : "")
            }
          </div>
        </div>}
      </div>
    </div>
  );
}

export default Home;
