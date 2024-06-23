import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const intitialState = {
  //this is the initial state that renders on the first run
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsremaining: null,
};
const t = 30;
function reducer(state, action) {
  //the reducer function handles all the state parameters
  switch (
    action.type //dispatch function gives data to the action to process
  ) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "failed" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsremaining: state.questions.length * t,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    case "tick":
      return {
        ...state,
        secondsremaining: state.secondsremaining - 1,
        status: state.secondsremaining === 0 ? "finished" : state.status,
      };
    case "restart":
      return {
        ...intitialState,
        status: "ready",
        questions: state.questions,
      };

    default:
      throw new Error("Action denied");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, intitialState);

  const { questions, status, index, answer, points, secondsremaining } = state; //these are the parameters of the state

  const numQuestions = questions.length;

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((a) => a.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data })) //here we see dispatch is giving the type and payload to action
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
              <Timer dispatch={dispatch} secondsremaining={secondsremaining} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
