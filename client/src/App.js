import React, { Component } from "react";
import SelectedSong from "./SelectedSong";
import SongSearch from "./SongSearch";
import { Container, Row, Col, Navbar, Nav, Button} from "react-bootstrap"
import ReactPlayer from 'react-player'
import Portis from '@portis/web3';
import Web3 from 'web3';
import ChartEEG from './ChartEEG'

const portis = new Portis('6ce97695-5f31-494f-ba6b-c44d52b626ae', 'ropsten');
const web3 = new Web3(portis.provider);

const base = 0.00016
const usd = 207.67

class App extends Component {

  state = {
    selectedSong: [],
    playSong: [],
    idx: -1,
    account: null,
    balance: 0,
    like: 0
  };


  componentDidMount(){
       this.setState({account : 'X'});
       web3.eth.getAccounts((error, accounts) => {
         console.log(accounts);
         if (accounts != null){
           this.setState({account : accounts[0]});
           this.updateBalance(accounts[0]);
         }

       });
   }



  removeSongItem = itemIndex => {
    const filteredSong = this.state.selectedSong.filter(
      (item, idx) => itemIndex !== idx
    );
    this.setState({ selectedSong: filteredSong });
  };

  payEth = (from, to, amount) => {
    let amountToSend = web3.utils.toWei(amount.toFixed(6).toString());
    var send = web3.eth.sendTransaction({from:from,to:to, value:amountToSend});
  };

  playSongItemNext = itemIndex => {
    if (this.state.like > 0){
      var re = /[0-9A-Fa-f]{6}/g;
      if (re.test(this.state.playSong[0].artist_address)){
        this.payEth(this.state.account, this.state.playSong[0].artist_address, this.state.like * base)
      }else{
        let address_to_pay_ens = this.state.playSong[0].artist_address
        let address_to_pay = web3.eth.ens.getAddress(address_to_pay_ens)
        address_to_pay.then(() => {
          this.payEth(this.state.account, address_to_pay, this.state.like * base)
        })
      }
    }
    this.playSongItem(this.state.idx + 1)
  }

  updateBalance = account => {
    web3.eth.getBalance(account, (error, result) => {
      if (!error){
        this.setState({ balance: web3.utils.fromWei(result)});
      }else{
        this.setState({ balance: 'X'});
      }
    });
  }

  clickButton = index => {
    this.setState({like : index});
  }

  playSongItem = itemIndex => {
    if (itemIndex >= this.state.selectedSong.length){
      itemIndex = 0;
    }

    const filteredSong = this.state.selectedSong.filter(
      (item, idx) => itemIndex === idx
    );
    this.setState({ playSong: filteredSong, idx: itemIndex, like: 0 });
  };

  addSong = song => {
    const newSong = this.state.selectedSong.concat(song);
    this.setState({ selectedSong: newSong });
  };

  updateLike = like => {
    this.setState({like: like });
  }

  render() {
    const { selectedSong } = this.state;
    const idx = this.state.idx + 1;
    let playSong = null
    let copyright = null
    let artist = null
    let name = null
    let address = null
    if (this.state.playSong[0]){
      playSong = this.state.playSong[0].source;
      copyright = this.state.playSong[0].copyright;
      artist = this.state.playSong[0].artist_name;
      name = this.state.playSong[0].name;
      address = this.state.playSong[0].artist_address;
    }

    let button_list = []
    for (let i = 0; i <= 10; i ++){
      let color = "danger"
      if (i > 2) color = "warning"
      if (i > 5) color = "success"
      if (i > 8) color = "primary"
      if (i !== this.state.like){
        color = "outline-" + color
      }
      button_list.push((<Button key={"like_" + i} style={{margin: '1em'}} variant={color} onClick={() => this.clickButton(i)}>{i}</Button>))
    }

    let content = null;

    if (this.state.account === null){

    }else if (this.state.account.length > 1){
      content = (<Container fluid style={{marginTop: '2em'}}>
        <Row>
          <Col sm={{ spen: 6, offset:3}}>
            <Row>
              <Col>
                <h2>{artist} {name}</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                Artist address : {address} tip : {(this.state.like * base).toFixed(6)} (${(this.state.like * base * usd).toFixed(2)})<br/>
              </Col>
            </Row>
            <Row>
              <Col>
                {button_list}
              </Col>
            </Row><Row>
              <ReactPlayer url={playSong} playing={true} controls={true} width='100%' height='2em' onEnded={this.playSongItemNext}/>
            </Row><Row>
              <Col>{copyright}</Col>
            </Row>
          </Col>
          <Col sm={3} className="bg-dark text-light">
            <ChartEEG updateLike={this.updateLike}></ChartEEG>
          </Col>
        </Row>
        <Row style={{marginTop: '2em'}}>
          <Col sm={3}>
            <div>
              <SongSearch onSongClick={this.addSong} />
            </div>
          </Col>
          <Col sm={{ spen: 7, offset:1}}>
            <SelectedSong
              song={selectedSong}
              onSongClick={this.playSongItem}
              onSongRemove={this.removeSongItem}
              />
          </Col>
        </Row>
      </Container>)
    }

    return (
      <div className="bg-dark h-100 text-light">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
        <img
          alt=""
          src="/favicon.ico"
          width="30"
          height="30"
          className="d-inline-block align-top"
          />{' '}
          EEG Like!
          </Navbar.Brand>
          <Nav>
          {this.state.account} - {this.state.balance} ETH
          </Nav>
        </Navbar>
        {content}
        </div>
    );
  }
}

export default App;
