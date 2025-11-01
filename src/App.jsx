import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState([])
  const [memory, setMemory] = useState(0)

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') inputNumber(parseInt(e.key))
      if (e.key === '.') inputDecimal()
      if (e.key === '+') performOperation('+')
      if (e.key === '-') performOperation('-')
      if (e.key === '*') performOperation('×')
      if (e.key === '/') { e.preventDefault(); performOperation('÷') }
      if (e.key === 'Enter' || e.key === '=') performOperation('=')
      if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clear()
      if (e.key === 'Backspace') backspace()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, operation, previousValue, waitingForOperand])

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (!waitingForOperand) {
      const newDisplay = display.slice(0, -1)
      setDisplay(newDisplay || '0')
    }
  }

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(-value))
  }

  const percentage = () => {
    const value = parseFloat(display) / 100
    setDisplay(String(value))
  }

  const sqrt = () => {
    const value = Math.sqrt(parseFloat(display))
    setDisplay(String(value))
    addToHistory(`√${display} = ${value}`)
  }

  const square = () => {
    const value = Math.pow(parseFloat(display), 2)
    setDisplay(String(value))
    addToHistory(`${display}² = ${value}`)
  }

  const reciprocal = () => {
    const value = 1 / parseFloat(display)
    setDisplay(String(value))
    addToHistory(`1/${display} = ${value}`)
  }

  const memoryStore = () => setMemory(parseFloat(display))
  const memoryRecall = () => setDisplay(String(memory))
  const memoryClear = () => setMemory(0)
  const memoryAdd = () => setMemory(memory + parseFloat(display))

  const addToHistory = (entry) => {
    setHistory(prev => [entry, ...prev.slice(0, 9)])
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`)
      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  return (
    <div className="app">
      <div className="calculator">
        <div className="header">
          <h1>Professional Calculator</h1>
          <div className="memory-indicator">{memory !== 0 && 'M'}</div>
        </div>
        
        <div className="display-section">
          <div className="operation-display">
            {previousValue && operation && `${previousValue} ${operation}`}
          </div>
          <div className="display">{display}</div>
        </div>

        <div className="buttons">
          <button className="btn memory" onClick={memoryClear}>MC</button>
          <button className="btn memory" onClick={memoryRecall}>MR</button>
          <button className="btn memory" onClick={memoryAdd}>M+</button>
          <button className="btn memory" onClick={memoryStore}>MS</button>
          
          <button className="btn function" onClick={clear}>C</button>
          <button className="btn function" onClick={backspace}>⌫</button>
          <button className="btn function" onClick={percentage}>%</button>
          <button className="btn operator" onClick={() => performOperation('÷')}>÷</button>
          
          <button className="btn function" onClick={sqrt}>√</button>
          <button className="btn function" onClick={square}>x²</button>
          <button className="btn function" onClick={reciprocal}>1/x</button>
          <button className="btn operator" onClick={() => performOperation('×')}>×</button>
          
          <button className="btn number" onClick={() => inputNumber(7)}>7</button>
          <button className="btn number" onClick={() => inputNumber(8)}>8</button>
          <button className="btn number" onClick={() => inputNumber(9)}>9</button>
          <button className="btn operator" onClick={() => performOperation('-')}>-</button>
          
          <button className="btn number" onClick={() => inputNumber(4)}>4</button>
          <button className="btn number" onClick={() => inputNumber(5)}>5</button>
          <button className="btn number" onClick={() => inputNumber(6)}>6</button>
          <button className="btn operator" onClick={() => performOperation('+')}>+</button>
          
          <button className="btn number" onClick={() => inputNumber(1)}>1</button>
          <button className="btn number" onClick={() => inputNumber(2)}>2</button>
          <button className="btn number" onClick={() => inputNumber(3)}>3</button>
          <button className="btn equals" onClick={() => performOperation('=')} rowSpan="2">=</button>
          
          <button className="btn function" onClick={toggleSign}>±</button>
          <button className="btn number" onClick={() => inputNumber(0)}>0</button>
          <button className="btn number" onClick={inputDecimal}>.</button>
        </div>
      </div>
      
      <div className="history-panel">
        <h3>History</h3>
        <div className="history-list">
          {history.map((entry, index) => (
            <div key={index} className="history-item">{entry}</div>
          ))}
        </div>
      </div>
      
      <div className="developer-credit">
        Developed by Abdul Basit Ahmadzai
      </div>
    </div>
  )
}

export default App