import React from 'react';
import '../css/listing.css';

const Listing = props => {

  const fetchDetails = charId => {
    props.getDetails(charId)
  }

  return (
    <div key={props.keyInd} className="list-container" onClick={() => fetchDetails(props.charId)}>
      <img src={props.image} alt={`${props.name}'s mushot`} />
      <div className="text-properties">
        <span className="name">Name: <span>{props.name}</span></span>
        <span className="location">Last seen: <span>{props.seen.name}</span></span>
        <span className="epoisode">Appeared in: <span>{`${props.episodes} ${props.episodes === 1 ? "episode" : "episodes"}`}</span></span>
      </div>
    </div>
  )
}

export default Listing;