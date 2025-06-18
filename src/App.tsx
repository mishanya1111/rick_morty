import {useState} from 'react'
import {useCounterStore} from './store/useCounterStore'

function App() {
  const {count, increment, decrement} = useCounterStore()
  return (
    <>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Count: {count}</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={increment}>+</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={decrement}>-</button>
      </div>
      )
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App
