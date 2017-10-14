import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import './grid.css';
import './bootstrap.min.css';
import _ from 'lodash';
import Timer from './Timer'
import $ from 'jquery'

const timePerQuestion = 180

let triviaBoard = [{
  q: 'What are the primary colors?',
  c: ['Yellow','Blue','Magenta','Green','Red'],
  a: [2, 4, 5],
  d: ''
 },{
  q: 'Identify the presidents..',
  c: ['Abraham Lincoln','Arnold Schwarzeneggar','Lyndon Johnson','George Washington','Sylvester Stallone'],
  a: [1, 3, 4],
  d: ''
 },{
  q: 'Identify the presidents..',
  c: ['Paul Ryan','Ron Paul','Mike Pence','Donald Trump','Vestibulum at eros'],
  a: [4],
  d: ''
},{
  q: 'Color from yellow and red?',
  c: ['Teal','Blue','Orange','Green','Pink'],
  a: [3],
  d: ''
 },{
  q: 'Color from Red and Blue?',
  c: ['Teal','Blue','Orange','Violet','Pink'],
  a: [4],
  d: ''
 }
]


function selectAnswer(props) {
  if(_.includes(props.currentTarget.classList, "btn-success") === true)
    document.getElementById(props.currentTarget.id).className = "btn btn-outline-primary btn-lg btn-block"
  else
    document.getElementById(props.currentTarget.id).className = "btn btn-success btn-lg btn-block"
}

function resetOptions() {
  _.range(5).forEach((ele) => {
    document.getElementById("opt"+ele).className = "btn btn-outline-primary btn-lg btn-block"
  })
}

function AnswerPanel(props) {
  let _options = props.opts
  return(
    <ul>
    {
      _options.map((option, index) => {
        let _id = "opt"+index
        return(
          <button type="button" id={_id} onClick = {selectAnswer} className="btn btn-outline-primary btn-lg btn-block">{option}</button>
        )
      })
    }
    </ul>
  )
}

function Question(props) {
  return (<p align="center"><strong>{props.question}</strong></p>)
}

function Progress(props) {
  return(
      <h5> Progress: {props.questionsAnswered} out of {props.noOfOptions} </h5>
  )
}

function ProgressBar(props) {
 {
    let _width = (props.questionsAnswered/ props.noOfOptions)*100
    const divStyle = {
      width: _width+'%',
      height: '20px'
    };
    return(
      <div style={divStyle} className="progress-bar bg-info" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    )
  }
}

let alerts = {
  "timeOut"      :  {
    "class" : "d-flex justify-content-center alert alert-warning alert-dismissible fade show",
    "msg"   : "<strong>Time Up! Next Question..</strong>"
  },
  "startQuiz"    : {
    "class" : "d-flex justify-content-center alert alert-success alert-dismissible fade show",
    "msg"   : "<strong>Beginning the test.. Good Luck!</strong>"
  },
  "nextQuestion" : {
    "class" : "d-flex justify-content-center alert alert-info alert-dismissible fade show",
    "msg"   : "<strong>Onto to the next question..</strong>"
  },
  "endOfTest"    : {
    "class" : "d-flex justify-content-center alert alert-danger alert-dismissible fade show",
    "msg"   : "Time Up! End of the quiz."
  }
}

function Start() {
  return(
    <button type="button" className="btn btn-success">Start Trivia</button>
  )
}

  function Score(props) {
    return(
        <div>
          <div id="endOfTest" className= {alerts["endOfTest"].class}>
            <strong>{alerts["endOfTest"].msg}</strong>
          </div>
          <div id="scoreBoard" className = {alerts["nextQuestion"].class}>
            <strong>Your Score: {props.score}</strong>
          </div>
        </div>
    )
  }


 class App extends Component {
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
      if(document.getElementById("msgStatus") && (this.state.elapsedMinutes == this.state.questionsAnswered)) {
        resetOptions()
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
    resetOptions()
  }

  startTest() {
    if(this.state.start == false) {
      this.state.start = true
      this.forceUpdate()
      this.timeOutTimer = setInterval(this.displayTimeOut, 50)
      this.state.elapsed =  new Date().getSeconds()
    }
    setInterval(() => {
      this.state.elapsedMinutes = this.state.elapsedMinutes+1
      this.state.questionsAnswered = this.state.questionsAnswered+1
    },60000)
  }

  moveToNextQuestion() {
    if(this.state.questionsAnswered < triviaBoard.length) {
      this.state.questionsAnswered = this.state.questionsAnswered+1
      let _questions = this.state.noOfOptions - this.state.questionsAnswered
      let _question  = triviaBoard[this.state.questionsAnswered-1].q
      let _options   = triviaBoard[this.state.questionsAnswered-1].c
      let _answer    = triviaBoard[this.state.questionsAnswered-1].a
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
    let question = (this.state.questionsAnswered == triviaBoard.length) ? {q:'',c:'',a:'',d:''} : triviaBoard[this.state.questionsAnswered]
    if(this.state.start == false) {
      return(
        <button type="button" onClick={this.startTest} className="btn btn-success">Start Trivia</button>
      )
    } else {
      if(this.state.questionsAnswered == triviaBoard.length) {
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


export default App;
