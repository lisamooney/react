import { useState } from 'react'
import { languages } from './languages'
import { clsx } from 'clsx'
import { getFarewellText, getRandomWord } from './utils'
import ConfettiDrop from './Confetti'

export default function AssemblyEndgame() {

    //State values
    const [currentWord, setCurrentWord] = useState(getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    //Derived values
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length -1 ]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
    
    //Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        
        return (
            <span 
                className={isLanguageLost ? 'chip lost' : 'chip'}
                key={index} 
                style={styles}>
                {lang.name}
            </span>
        )
    })
    const letters = Array.from(currentWord)
    const letterArray = letters.map((letter, index) => 
        {
            const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
            const letterClassName = clsx(
                isGameLost && !guessedLetters.includes(letter) && "missed-letter"
            )
            return (
                <span key={index} className={letterClassName}>{shouldRevealLetter ? letter : ''}</span>
            )
        }
    )

    const keyboard = Array.from(alphabet)
    const keyboardArray = keyboard.map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        return (
            <button 
                className={className}
                key={letter} 
                id={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetters(letter)}>{letter}
            </button>
        )
    })

    function addGuessedLetters(letter) {
        setGuessedLetters(
            prevLetters => 
                prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
        )
    }
    const gameStatus = clsx('status', 
        {
            won: isGameWon,
            lost: isGameLost,
            farewell: !isGameOver && isLastGuessIncorrect
        }
    )
    function returnGameStatus() {
        if(!isGameOver && isLastGuessIncorrect) {
            return (<p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>)
        }
        if(isGameWon) {
            return (
                <>
                    <h2>You Win! &#129395;</h2>
                </>
            )
        } 
        if(isGameLost) {
            return (
                <>
                    <h2>You lose! Better learn Assembly 😭</h2>
                </>
            )
        }
        return null
    }
    function resetGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    return (
        <>
            {isGameWon && 
                <ConfettiDrop />
            }
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
            </header>
            <div className={gameStatus} role="status" aria-live="polite">
                {returnGameStatus()}
            </div>
            <div className='chip-container'>
                {languageElements}
            </div>
            <div className='letter-container'>
                {letterArray}
            </div>
            {/* status updates hidden. for screen readers only */}
            <div className='sr-only' aria-live="polite" role="status">
                <p>{currentWord.includes(lastGuessedLetter) ? 
                    `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                    `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split('').map(letter => guessedLetters.includes(letter) ? letter : 'blank').join(' ')}</p>
            </div>
            <div className="keyboard">
                {keyboardArray}
            </div>
            {isGameOver && <button className="new-game" onClick={resetGame}>New Game</button>}
        </>
    )
}