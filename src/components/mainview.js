import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import Typist from 'react-typist'
import TypistLoop from 'react-typist-loop'


const ABI = require('../abi/itys.js');
const BAIT = require('../abi/bait.js');

class MainView extends Component {
  constructor(props,context) {
    var error="";
    super(props);
    this.state = {
        web3:true,
        account:"",
        network:"4",
        statement:"",
        hist:[],
        lastTXHash:""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUserValues = this.updateUserValues.bind(this);
    this.initiateTx = this.initiateTx.bind(this);
  }
  updateUserValues(){
    if(typeof web3 === "undefined")
      this.setState({web3:false});
    else{
      window.web3.version.getNetwork(function (error,result){
        
        this.setState({network:result});

        
      }.bind(this));
      window.web3.eth.getAccounts(function (error,result){
      if(window.web3.isAddress(result[0]))
        this.setState({account:result[0]});
      this.forceUpdate();

      }.bind(this));
    }
  }
  componentDidMount() {
    this.updateUserValues();


  }

  initiateTx() {
    var statement = this.state.statement;
    this.setState({statement:""});
    var account = this.state.account;
    var inter=ABI.ABI;
    var ITYScontract = window.web3.eth.contract(inter);
    var myITYS = ITYScontract.at("0x81570bd7dc463abb8991ccb0fcdd018cd78cb7f2");
    myITYS.IToldYouSo(
      statement,
      { from: account, value: window.web3.toWei(0.001, 'ether'),gasPrice: window.web3.toWei(11,'gwei')},
     function(err, transactionHash) {
      if (!err){
      this.setState({lastTXHash:transactionHash});
      }
      else
        alert("Error Occured":err);
    }.bind(this));
  }
  handleChange(event) {
    this.setState({statement: event.target.value});
  }

  handleSubmit(event) {
    this.initiateTx()
  }
  callbackForStatement(i){
    
    var inter=ABI.ABI;
    var ITYScontract = window.web3.eth.contract(inter);
    var myITYS = ITYScontract.at("0x81570bd7dc463abb8991ccb0fcdd018cd78cb7f2");
    myITYS.aParticularThingIHaveSaid(i,
        function(error, statement){
          var temp=this.state.hist;
          temp[i]=statement;
          this.setState({
            hist: temp
          })        
      }.bind(this));
          
  }
  history() {
    var inter=ABI.ABI;
    var ITYScontract = window.web3.eth.contract(inter);
    var myITYS = ITYScontract.at("0x81570bd7dc463abb8991ccb0fcdd018cd78cb7f2");
    myITYS.numberOfThingsIHaveSaid(
      function(error,result){
      var  x=(result['c'][0])
      for(var i=0;i<x;i++){
        if(!this.state.hist[i])
          this.callbackForStatement(i)        
      }
    
      }.bind(this));

  }
  render() {
    const form = (
      <form onSubmit={this.initiateTx}>
        <label>
          
          <input type="text" value={this.state.statement} onChange={this.handleChange}/>
        </label>
        </form>
    );

    const tx = (<p>
      <p></p>
      <h4>Note you transaction hash to rub it in everyone's face later</h4>
      <a href={"https://etherscan.io/tx/"+this.state.lastTXHash}>{this.state.lastTXHash}</a>
      </p>
      );
    
    
    var bait=BAIT.BAIT;
    if(this.state.account==="") {
      this.error = "Please unlock your MetaMask Account and refresh."
      if(this.state.network!=="1") {
        this.error = "Please Switch to the Main Network and refresh."
        if(this.web3===undefined) {
          this.error = "No Web3 client found, please install MetaMask and refresh."

        }
      }

    }
    else {
      this.history()
      if(this.state.network!=="1") {
        this.error = "Please Switch to the Main Network and refresh."
      }
      else
        this.error=""
    }
    
    return (
    <div>
      
      <header id="header">
        <h1>I Told You So</h1>
        <h2>Need to make a statement that will stand the test of time? Etch it into the blockchain.</h2>
        <p>
        <TypistLoop interval={3000}>
          {bait.map(text => <Typist key={text} startDelay={1000}>{text}</Typist>)}
        </TypistLoop>
        </p>
      </header>
      <div hidden={this.error!==""}>
      {form}
      <button onClick={this.initiateTx}>
       <h2> I Told You So </h2>
      </button>
      <div hidden={this.state.lastTXHash===""}>
        {tx}
      </div>
      </div>
      <p>{this.error}</p>



    <footer id="footer">
        <ul class="icons">
          <li>Share on <a href="http://twitter.com/share?text=Check ou this DApp!&url=http://itoldyouso.fun&hashtags=ethereum,blockchain,itoldyouso" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
        </ul>
        <ul class="copyright">
          <li>Made with React and Solidity</li><li><a href="https://twitter.com/raghavtosh">@raghavtosh</a></li>
        </ul>
    </footer>
      
    </div>
    );
  }  

}


MainView.contextTypes = {
  web3: PropTypes.object
};

export default MainView;