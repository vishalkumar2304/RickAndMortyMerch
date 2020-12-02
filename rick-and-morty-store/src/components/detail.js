import React from 'react';
import axios from 'axios';

const Detail = props => {
  const [details, setDetails] = React.useState(null);
  const [epDetails, setEpDetails] = React.useState(null);

  React.useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/character/${props.charId}`).then((data) => {
      if (data.data) {
        let CSEpisodes = [];
        data.data.episode.forEach(episode => {
          const episodeNumber = episode.split('/').pop();
          CSEpisodes.push(episodeNumber)
        })
        setDetails(data.data)
        axios.get(`https://rickandmortyapi.com/api/episode/${CSEpisodes}`).then((data) => {
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
    details ? <div className="list-container">
      <div>
        <span className="back-btn" onClick={() => { props.closeDetail() }}>{`<-`}</span>
      </div>
      <img src={details.image} alt={`${details.name}'s mushot`} />
      <span className="id">{details.id}</span>
      <span className="name">{details.name}</span>
      <span className="status">{details.status}</span>
      <span className="species">{details.species}</span>
      {details.type != "" && <span className="type">{details.type}</span>}
      <span className="gender">{details.gender}</span>
      <span className="origin">{details.origin.name}</span>
      <span className="created">{new Date(details.created).getFullYear()}</span>
      <span className="location">{details.location.name}</span>
      {epDetails && epDetails.map((episodes, ind) => {
        return (
          <a href={episodes.url}>
            <span className="epoisode">{episodes.name}</span>
          </a>
        )
      })}
      <div className="CTA-btn" onClick={() => { window.alert(`You will be redirected to ${details.name}'s merch page`) }}>Buy merchandise</div>
    </div> : ""
  )
}

export default Detail;