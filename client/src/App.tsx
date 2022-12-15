import './App.css';
import ApiTravel from "./network/travel/TravelNetwork";

const checkAlive = () => {
  ApiTravel.getServerAlive()
  .then(resp => alert("Alive Server"))
  .catch(err => alert("Dead Server"))
}

const checkTravelAlive = () => {
  ApiTravel.getServerAlive()
  .then(resp => alert("Alive Server Travel"))
  .catch(err => alert("Dead Server Travel"))
}

function App() {
  return (
    <div className="App">
      <h1> Bealy Technical Test</h1>
      <button onClick={checkAlive}> API ALIVE</button>
      <button onClick={checkTravelAlive}> API TRAVEL ALIVE</button>
    </div>
  )
}

export default App
