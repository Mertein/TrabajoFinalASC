'use client'
import React from 'react'
import useSWR from 'swr'
function Question() {
    const fetcher = (arg: any, ...args: any) => fetch(arg, ...args).then(res => res.json())
    const { data: question, error, isLoading } = useSWR('/api/faqs/question', fetcher)

  const renderQuestion = () => {
    return  question && question.map((quest:any) => {
      return (
        <li  className='' key={quest.id}>{quest.ask}</li>
      )
    })
  }

  console.log(renderQuestion())
  return (
    <div> 
      <ul>{renderQuestion()}</ul>
    </div>
  );
}

export default Question