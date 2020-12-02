import React from 'react';

const Listing = props => {

    const fetchDetails = charId => {
        console.log(charId)
    }

    return(
        <div key={props.keyInd} className="list-container" onClick={()=>fetchDetails(props.charId)}>
            <img src={props.image} alt={`${props.name}'s mushot`}/>
            <span className="name">{props.name}</span>
            <a href={props.seen.url}><span className="location">{props.seen.name}</span></a>
            <span className="epoisode">{props.episodes}</span>
        </div>
    )
}

export default Listing;