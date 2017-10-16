
const timePerQuestion = 180

export const alerts = {
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
