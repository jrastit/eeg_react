import React from "react";
import {Row, Col, Card} from 'react-bootstrap';


export default function SelectedSong(props) {
  const { song } = props;

  const songRows = song.map((song, idx) => (
    <Col sm={2} key={idx} onClick={() => props.onSongClick(idx)} >
      <Card className="text-dark">
        <Card.Img variant="top" src={song.artist_picture}/>
        <Card.Body>
          <Card.Title>{song.artist_name}</Card.Title>
          <Card.Text>{song.name}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <div>
      <Row>
        {songRows}
      </Row>
    </div>
  );
}
