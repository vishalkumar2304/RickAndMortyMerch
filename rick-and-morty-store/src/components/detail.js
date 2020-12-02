import React from 'react';
import {get} from '../utils/common';

import Loader from "../components/loader";

import '../css/detail.css';

const Detail = props => {
  const [details, setDetails] = React.useState(null);
  const [epDetails, setEpDetails] = React.useState(null);

  React.useEffect(() => {
    get(`https://rickandmortyapi.com/api/character/${props.charId}`).then((data) => {
      if (data.data) {
        let CSEpisodes = [];
        data.data.episode.forEach(episode => {
          const episodeNumber = episode.split('/').pop();
          CSEpisodes.push(episodeNumber)
        })
        setDetails(data.data)
        get(`https://rickandmortyapi.com/api/episode/${CSEpisodes}`).then((data) => {
          if (data.data) {
            if (data.data.length > 0) {
              setEpDetails(data.data)
            }
            else {
              setEpDetails([data.data])
            }
          }
        })
      }
    })
  }, [0])

  return (
    details ? <div className="detail-container">
      <div>
        <span className="back-btn" onClick={() => { props.closeDetail() }}>&#10005;</span>
      </div>
      <img src={details.image} alt={`${details.name}'s mushot`} />
      <span className="id">ID: <span>{details.id}</span></span>
      <span className="name">Name: <span>{details.name}</span></span>
      <span className="status">Status: <span>{details.status}</span></span>
      <span className="species">Species: <span>{details.species}</span></span>
      {details.type != "" && <span className="type">Type: <span>{details.type}</span></span>}
      <span className="gender">Gender: <span>{details.gender}</span></span>
      <span className="origin">Originated from: <span>{details.origin.name}</span></span>
      <span className="created">Created in: <span>{new Date(details.created).getFullYear()}</span></span>
      <span className="location">Last seen at: <span>{details.location.name}</span></span>
      {epDetails && <div className="episode-list-label">
      {`Featured in ${epDetails.length === 1 ? "episode" : "episodes"}: `}
      </div>}
      {epDetails && <div className="episode-list-container">
      {epDetails.map((episodes, ind) => {
        return (
          <a href={episodes.url} key={`all_episodes_${ind}`}>
            <span className="epoisode">{episodes.name}</span>
          </a>
        )
      })}
      </div>}
      <div className="CTA-btn" onClick={() => { window.alert(`You will be redirected to ${details.name}'s merch page`) }}>Buy merchandise</div>
    </div> : <Loader isLoader={true}/>
  )
}

export default Detail;