import React from "react";
import Client from "./Client";
import {Row, Col, Image, ListGroup, Form, InputGroup} from 'react-bootstrap';

const MATCHING_ITEM_LIMIT = 25;

class SongSearch extends React.Component {
  state = {
    song: [],
    showRemoveIcon: false,
    searchValue: ""
  };

  handleSearchChange = e => {
    const value = e.target.value;

    this.setState({
      searchValue: value
    });

    if (value === "") {
      this.setState({
        song: [],
        showRemoveIcon: false
      });
    } else {
      this.setState({
        showRemoveIcon: true
      });

      Client.search(value, song => {
        this.setState({
          song: song.slice(0, MATCHING_ITEM_LIMIT)
        });
      });
    }
  };

  handleSearchCancel = () => {
    this.setState({
      song: [],
      showRemoveIcon: false,
      searchValue: ""
    });
  };

  render() {
    const { showRemoveIcon, song } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };
    const songRows = song.map((song, idx) => (
      <ListGroup.Item key={idx} onClick={() => this.props.onSongClick(song)}>
      <Row>
        <Col sm={4} >
          <Image src={song.artist_picture}/>
        </Col>
        <Col sm={8}>
          <Row>
            <Col>{song.artist_name}</Col>
          </Row><Row>
            <Col>{song.name}</Col>
          </Row>
        </Col>
      </Row>
      </ListGroup.Item>
    ));

    return (
      <div>

          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search song or artist..."
              value={this.state.searchValue}
              onChange={this.handleSearchChange}
              />
              <InputGroup.Append>
                <i className="search icon" />
              </InputGroup.Append>
              <InputGroup.Append>
              <i
                className="remove icon"
                onClick={this.handleSearchCancel}
                style={removeIconStyle}
              />
              </InputGroup.Append>
          </InputGroup>
        <div id="song-search" style={{marginTop: '2em'}}>
          <ListGroup className="text-dark">
            {songRows}
          </ListGroup>
        </div>
    </div>
    );
  }
}

export default SongSearch;
