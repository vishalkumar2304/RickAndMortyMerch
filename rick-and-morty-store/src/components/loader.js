import React from "react";
import "../css/loader.css";

const Loader = (props) => (
  <section className={`loaderWrapper ${props.isLoader ? "show" : "hide"}`}>
    <section className="loader-overlay"></section>
      <article className="loading-text-cont">
        <div>Loading..</div>
      </article>
  </section>
)
export default Loader;
