import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DiscussionQuestionsProps {
  questions: string[];
}

export function DiscussionQuestions({ questions }: DiscussionQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="questions" className="border-border/50 rounded-xl overflow-hidden bg-card/50">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-card/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Think about this...</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={index} className="border-border/50 shadow-sm bg-background">
                  <CardContent className="p-4 flex gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground leading-relaxed pt-1">
                      {question}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
