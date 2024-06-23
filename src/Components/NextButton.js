export default function NextButtuon({ answer, dispatch, index, numQuestions }) {
  if (answer === null) return null;
  else if (index < numQuestions - 1)
    return (
      <button
        className=" btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  else if (index === numQuestions - 1)
    return (
      <button
        className=" btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}
