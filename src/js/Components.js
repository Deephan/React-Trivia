import React from 'react';
import {alerts} from './constants'
import _ from 'lodash';

export function Score(props) {
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


function selectAnswer(props) {
  if(_.includes(props.currentTarget.classList, "btn-success") === true)
    document.getElementById(props.currentTarget.id).className = "btn btn-outline-warning btn-lg btn-block"
  else
    document.getElementById(props.currentTarget.id).className = "btn btn-warning btn-lg btn-block"
}

export function AnswerPanel(props) {
  let _options = props.opts
  return(
    <ul>
    {
      _options.map((option, index) => {
        let _id = "opt"+index
        return(
          <button type="button" id={_id} onClick = {selectAnswer} className="btn btn-outline-danger btn-lg btn-block">{option}</button>
        )
      })
    }
    </ul>
  )
}

export function Question(props) {
  return (<p align="center"><strong>{props.question}</strong></p>)
}

export function Progress(props) {
  return(
      <h5> Progress: {props.questionsAnswered} out of {props.noOfOptions} </h5>
  )
}

export function ProgressBar(props) {
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
