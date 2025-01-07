import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "./data";

export function FAQs() {
  return (
    <Accordion type="single" collapsible className="w-full lg:w-[70%] bg-white p-6 rounded-md ">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
