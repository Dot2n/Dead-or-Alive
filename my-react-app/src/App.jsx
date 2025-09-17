import { useState, useEffect } from 'react'
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [userNum, setUserNum] = useState({
    firstNum: "",
    secondNum: "",
    thirdNum: "",
    fourthNum: "",
  })
  const [history, setHistory] = useState([])
  const [reset, setHandleReset] = useState(true)
  const [successMessage, setSuccessMessage] = useState("You won")
  const [submitted, setSubmitted] = useState([])
  const [backendResult, setBackendResult] = useState({})
  const [showInputs, setShowInputs] = useState(false);
  const [areAllDifferent, setAreAllDifferent] = useState(true);
  const [duplicates, setDuplicates] = useState({
    firstNum: false,
    secondNum: false,
    thirdNum: false,
    fourthNum: false,
  });

  const getUserNum =  (e, inputKey) => {
    setUserNum((prevInputs) => ({
      ...prevInputs,
      [inputKey]: e.target.value,
    }));
  };
  useEffect(() => {
    const values = Object.values(userNum);
    const keys = Object.keys(userNum);
    const uniqueValues = new Set(values);
    const hasDuplicates = values.some((val) => val !== '') && uniqueValues.size < values.length;

    // Track which inputs are duplicates
    const duplicateStatus = {};
    if (hasDuplicates) {
      const valueCount = {};
      // Count occurrences of each value
      values.forEach((val, index) => {
        if (val !== '') {
          valueCount[val] = (valueCount[val] || 0) + 1;
          duplicateStatus[keys[index]] = valueCount[val] > 1;
        } 
        else {
          duplicateStatus[keys[index]] = false;
        }
      });
    } 
    else {
      keys.forEach((key) => {
        duplicateStatus[key] = false;
      });
    }

    setDuplicates(duplicateStatus);
    setAreAllDifferent(!hasDuplicates);
  }, [userNum]);

  function buttonClass(){
    if((userNum.firstNum =="" || userNum.secondNum == "" || userNum.thirdNum == "" || userNum.fourthNum == "" ) ||
    (duplicates.firstNum || duplicates.secondNum || duplicates.thirdNum || duplicates.fourthNum) || 
    backendResult.dead == 4){
      return "invisible"
    }
    else{
      return "visible"
    }
  }

  const handleSubmit = async (e) => { 
  e.preventDefault();
  const res = await fetch(`${API_URL}/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userNum),
  });
  const data = await res.json(); 

  const newGuess = data.userGuesses[data.userGuesses.length - 1];
  setSubmitted((prev) => [newGuess, ...prev ]);
  
  const newHistory = data.userResult[data.userResult.length-1] 
  setHistory((prevResult) => [ newHistory, ...prevResult])
  
  setBackendResult(newHistory);

  setUserNum({
    firstNum: "",
    secondNum: "",
    thirdNum: "",
    fourthNum: "",
  })
  };
    
  useEffect(() => {
    console.log("✅ Updated history:", history);
  }, [history]);

  useEffect(() => {
    console.log("✅ Updated submitted:", submitted);
  }, [submitted]);


  //keep db showing in the frontend after refresh
  useEffect(() => {
    fetch(`${API_URL}/submissions`)
    .then(res => res.json())
    .then(data => {
      setSubmitted([...data.userGuess].reverse());
      setHistory([...data.userResult].reverse());
    })
    .catch(err => {
      console.error("Error fetching past submissions:", err);
    });
  }, []);
  
  // handle Reset
  const handleReset = async(e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({reset}),
    });

    const data = await res.json()
    console.log(data) 
    setHistory([]);
    setSubmitted([]); 
    setBackendResult({})
    setUserNum({
      firstNum: "",
      secondNum: "",
      thirdNum: "",
      fourthNum: "",
    })
  }

  function handleInputLength(e){    
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1) 
    }
  }

  const forms = (
    <form className='joke' method="post" >
     
      <br />

      <input type='number'
        onInput={handleInputLength}
        onChange={(e) => getUserNum(e, "firstNum")} 
        value={userNum.firstNum} 
        maxLength={1}
        className={duplicates.firstNum ? 'input-error' : 'input-normal'}
      />
      <input type='number'
        onWheel={(e) => e.target.blur()}
        onInput={handleInputLength}
        onChange={(e) => getUserNum(e, "secondNum")} 
        value={userNum.secondNum} 
        maxLength={1}
        className={duplicates.secondNum ? 'input-error' : 'input-normal'}
      />
      <input type='number'
        onWheel={(e) => e.target.blur()}
        onInput={handleInputLength}
        onChange={(e) => getUserNum(e, "thirdNum")} 
        value={userNum.thirdNum} 
        maxLength={1}
        className={duplicates.thirdNum ? 'input-error' : 'input-normal'}
      />
      <input type='number'
        onWheel={(e) => e.target.blur()}
        onInput={handleInputLength}
        onChange={(e) => getUserNum(e, "fourthNum")} 
        value={userNum.fourthNum} 
        maxLength={1}
        className={duplicates.fourthNum ? 'input-error' : 'input-normal'}
      /> 
      <br />
      <button type='submit' onClick={handleReset} className='reset'> Reset </button>

      <button type="submit"
        className={buttonClass()}
        onClick={handleSubmit}>submit 
      </button> 
    </form>
  )

  return(
    <div className='texts'>
      <p>{backendResult.dead ==4 ? successMessage : ""}</p>
      <div className='guesses'>
      {forms}
      </div>
     
      <table className='results'> 
        <thead>
          <tr>
            <th> Numbers</th>
            <th> Dead</th>
            <th> Injured</th>
          </tr>
        </thead>
        <tbody>
          {
            submitted.map((item, index)=>(
              <tr key={index}> 
                <td> {item} </td>
                <td> {history[index]?.dead}</td>
                <td> {history[index]?.injured}</td> 
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default App