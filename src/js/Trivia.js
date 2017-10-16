import React, { Component } from 'react';
//import logo from './logo.svg';
import '../css/App.css';
import '../css/grid.css';
import '../css/bootstrap.min.css';
import _ from 'lodash';
import Timer from './Timer'
import {Score, Question, AnswerPanel, Progress, ProgressBar} from './Components'
import {alerts} from './constants'
import {triviaBoard} from './questions'


 class Trivia extends Component {
  constructor(props) {
    super(props)
    this.state  = {
      question: '',
      answer: '',
      questionsAnswered: 0,
      noOfOptions: triviaBoard.length,
      questionsRemaining: triviaBoard.length,
      start: false,
      elapsed: 0,
      elapsedMinutes: 0,
      score: 0
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.calculateScore = this.calculateScore.bind(this)
    this.moveToNextQuestion = this.moveToNextQuestion.bind(this)
    this.displayTimeOut = this.displayTimeOut.bind(this)
    this.startTest = this.startTest.bind(this)
    this.resetOptions = this.resetOptions.bind(this)
  }


  resetOptions() {
    _.range(5).forEach((ele) => {
       document.getElementById("opt"+ele).className = "btn btn-outline-primary btn-lg btn-block"
    })  
  }

  displayStartOfTest() {
    if(document.getElementById("msgStatus")) {
      setTimeout(() => {
           document.getElementById("msgStatus").className = alerts["startQuiz"].class
           document.getElementById("msgStatus").innerHTML = alerts["startQuiz"].msg
      },500)

      setTimeout(() => {
           document.getElementById("msgStatus").className = "invisible " +alerts["startQuiz"].class
      },3000)
    }
  }

  displayEndOfTest() {
    if(document.getElementById("msgStatus")) {
      document.getElementById("msgStatus").className = alerts["endOfTest"].class
      document.getElementById("msgStatus").innerHTML = alerts["endOfTest"].msg
      setTimeout(() => {
          document.getElementById("msgStatus").className = "invisible "+alerts["endOfTest"].class
      },3000)
    }
  }

  displayTimeOut() {
    if(this.state.questionsAnswered > 0) {
      if(document.getElementById("msgStatus") && (this.state.elapsedMinutes === this.state.questionsAnswered)) {
        this.resetOptions()
        this.moveToNextQuestion()
        if(document.getElementById("msgStatus"))document.getElementById("msgStatus").className = alerts["timeOut"].class
        if(document.getElementById("msgStatus"))document.getElementById("msgStatus").innerHTML = alerts["timeOut"].msg
        setTimeout(() => {
            if(document.getElementById("msgStatus"))
            document.getElementById("msgStatus").className = "invisible "+alerts["timeOut"].class
        },3000)
      }
    }
  }

  displayNextQuestion() {
    if(document.getElementById("msgStatus")) {
      if(document.getElementById("msgStatus")) document.getElementById("msgStatus").className = alerts["nextQuestion"].class
      if(document.getElementById("msgStatus")) document.getElementById("msgStatus").innerHTML = alerts["nextQuestion"].msg
      setTimeout(() => {
        if(document.getElementById("msgStatus"))
          document.getElementById("msgStatus").className = "invisible "+alerts["nextQuestion"].class
      },1000)
    }
  }


  calculateScore(currentAnswer, givenAnswer) {
    let currentAns = _.split(currentAnswer, '')
    let givenAns = _.split(givenAnswer, '')
    let _score = 0
    _.range(this.state.noOfOptions).forEach((ele) => {
      _score += (_.eq(currentAns[ele], givenAns[ele])) ? 1 : -1
    })
    _score = (this.state.score + _score) >= 0 ? (this.state.score + _score) : 0
    this.setState({
      score: _score
    })
  }

  handleSubmit(event) {
    let givenAnswer = ''
    let correctAnswer = ''
    let _answer    = triviaBoard[this.state.questionsAnswered].a
    _.range(this.state.noOfOptions).forEach(function(ele) {
      givenAnswer += (_.includes(document.getElementById('opt'+(ele)).classList, "btn-success") === true) ? '1' : '0'
      correctAnswer += (_.includes(_answer, ele+1) === true) ? '1' : '0'
    })
    this.calculateScore(givenAnswer, correctAnswer)
    this.moveToNextQuestion()
    this.displayNextQuestion()
    this.resetOptions()
  }

  startTest() {
    if(this.state.start === false) {
      this.setState({start: true})
      this.forceUpdate()
      this.timeOutTimer = setInterval(this.displayTimeOut, 50)
      this.setState({elapsed:  new Date().getSeconds()})
    }
    setInterval(() => {
      this.setState({
        elapsedMinutes: this.state.elapsedMinutes+1,
        questionsAnswered: this.state.questionsAnswered+1
      })
    },60000)
  }

  moveToNextQuestion() {
    if(this.state.questionsAnswered < triviaBoard.length) {
      let _index = this.state.questionsAnswered
      this.setState({questionsAnswered: _index+1})
      let _questions = this.state.noOfOptions - this.state.questionsAnswered
      let _question  = triviaBoard[_index].q
      let _options   = triviaBoard[_index].c
      let _answer    = triviaBoard[_index].a
      this.setState({
        question: _question,
        options: _options,
        answer: _answer,
        questionsRemaining: _questions,
        elapsed: new Date().getSeconds()
      });
    }
  }

  render() {
    let question = (this.state.questionsAnswered === triviaBoard.length) ? {q:'',c:'',a:'',d:''} : triviaBoard[this.state.questionsAnswered]
    if(this.state.start === false) {
      return(
        <button type="button" onClick={this.startTest} className="btn btn-success">Start Trivia</button>
      )
    } else {
      if(this.state.questionsAnswered === triviaBoard.length) {
        return(
         <Score score={this.state.score}/>
        )
      } else {
        return(
            <form onSubmit = {this.handleSubmit}>
              <div className="row">
                  <div className="col-md-8">
                    <Question question = {question.q}/>
                    <hr/>
                    <ul className="list-group">
                      <AnswerPanel opts = {question.c}/>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <Progress questionsAnswered = {this.state.questionsAnswered} noOfOptions = {this.state.noOfOptions} />
                     <div className="progress">
                      {
                        <ProgressBar questionsAnswered = {this.state.questionsAnswered} noOfOptions = {this.state.noOfOptions}/>
                      }
                     </div>
                      <br/>
                      <Timer start={Date.now()} />
                      <div id="msgStatus"></div>
                      <br/>
                      <div id="info" className="d-flex justify-content-center alert alert-secondary alert-dismissible fade show" role="dialog">
                        Time per question: 3 Minutes<br/>
                      </div>
                     <br/>
                    </div>
              </div>
              <button type="button" onClick={this.handleSubmit} className="btn btn-outline-secondary btn-lg btn-block">Submit</button>
            </form>
        )
      }
    }
  }


 }


export default Trivia;
