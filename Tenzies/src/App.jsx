import { useState, useRef, useEffect } from "react"
import './App.css'
import Die from './components/Die'
import {nanoid} from 'nanoid'
//nano id is a node package, no need to install just use the above import and call the function wherever you need a unique id
import ConfettiDrop from './components/Confetti'

function App() {
  {/* the anonymous function in the parameter of useState makes sure the function doesn't run every time the state changes eg: whenever we click a number to hold it */}
  const [dice, setDice] = useState(() => generateAllNewDice())

  //array method .every returns a boolean, so in this case, if every die is held, it returns true
  //the second part of the statement gets the value from one die and compares the other dice values to it
  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

  function generateAllNewDice() {
    {/* the 10 is the number of items we need 
      the 0 is just a placeholder number 
      then we map the array with the random numbers
      ceil will omit the 0 where floor will include it*
      */}
    return new Array(10)
        .fill(0)
        .map(() => ({
          value: Math.ceil(Math.random() * 6), 
          isHeld: false,
          id: nanoid()
      }))
    }

   function hold(id) {
      setDice(
      prevDice => prevDice.map(item => {
          return item.id === id ? {...item, isHeld: !item.isHeld } : item
      }))
    }

    const diceElements = dice.map(dieObject => (
    <Die 
    key={dieObject.id} 
    value={dieObject.value} 
    isHeld={dieObject.isHeld} 
    hold={hold}
    id={dieObject.id}
    />)
  )

   function rollDice() {
    gameWon ? setDice(() => generateAllNewDice()) :
      setDice(
        oldDice => oldDice.map(die => 
          die.isHeld ? die : {...die, value: Math.ceil(Math.random() * 6)}
      ))
   }
   //this is for accessibility
   //the buttonRef gets the class of the element that has the buttonRef property
   const buttonRef = useRef(null)

   //useEffect looks at whether the game is won, if so, run the code to add focus on to button
  useEffect(() => {
      if(gameWon) {
          buttonRef.current.focus()
      }
  }, [gameWon]) 

    return (
      <main>
        {gameWon ? <ConfettiDrop /> : null}
        {<div aria-live="polite" className="sr-only">
          {gameWon && <p>Congratulations! You won! Press New Game to start again.</p>}
          </div>}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
            {diceElements}
        </div>
        <button ref={buttonRef} className='roll' id='roll' onClick={rollDice}>{gameWon ? "New game" : "Roll"}</button>
      </main>
    )
}

export default App
