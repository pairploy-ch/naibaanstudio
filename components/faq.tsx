'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

type Faq = {
  id: string
  question: string
  answer: string
  sort_order: number
}

export default function Faq() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Failed to load FAQs:', error)
        if (data) setFaqs(data as Faq[])
        setLoading(false)
      })
  }, [])

  if (!loading && faqs.length === 0) return null

  return (
    <div className="bg-[#F6EFE7] py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-5xl font-bold text-black mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-black mb-12 text-lg">
          Everything you need to know before joining a class
        </p>

        {loading ? (
          <p className="text-center text-black">Loading...</p>
        ) : (
          <Accordion type="single" collapsible className="bg-white border-2 border-black px-6">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-black">
                <AccordionTrigger className="text-lg font-bold text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-black leading-relaxed whitespace-pre-wrap">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
