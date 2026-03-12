import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { calculateBand } from '@/lib/bandCalculator';
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearnerInput {
  id: string;
  name: string;
  birthDate: string;
  suggestedBand: number;
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [familyName, setFamilyName] = useState('');
  const [learners, setLearners] = useState<LearnerInput[]>([
    { id: crypto.randomUUID(), name: '', birthDate: '', suggestedBand: 2 }
  ]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step === 4 && topics.length === 0) {
      fetchTopics();
    }
  }, [step]);

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch topics');
      const data = await res.json();
      setTopics(data);
      if (data.length > 0) setSelectedTopicId(data[0].id);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error loading topics', variant: 'destructive' });
    } finally {
      setLoadingTopics(false);
    }
  };

  const nextStep = () => {
    if (step === 2 && !familyName.trim()) {
      toast({ title: 'Family name required', variant: 'destructive' });
      return;
    }
    if (step === 3) {
      const valid = learners.every(l => l.name.trim() && l.birthDate);
      if (!valid) {
        toast({ title: 'Please fill out all learner details', variant: 'destructive' });
        return;
      }
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const addLearner = () => {
    setLearners([...learners, { id: crypto.randomUUID(), name: '', birthDate: '', suggestedBand: 2 }]);
  };

  const removeLearner = (id: string) => {
    if (learners.length > 1) {
      setLearners(learners.filter(l => l.id !== id));
    }
  };

  const updateLearner = (id: string, field: keyof LearnerInput, value: any) => {
    setLearners(learners.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        if (field === 'birthDate' && value) {
          const { band } = calculateBand(new Date(value));
          updated.suggestedBand = band;
        }
        return updated;
      }
      return l;
    }));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';

      // 1. Create Family
      const familyRes = await fetch(`${apiUrl}/api/family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: familyName }),
        credentials: 'include',
      });
      if (!familyRes.ok) throw new Error('Failed to create family');

      // 2. Add Learners
      for (const learner of learners) {
        const res = await fetch(`${apiUrl}/api/family/learners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: learner.name,
            birthDate: learner.birthDate,
            band: learner.suggestedBand
          }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to add learner ${learner.name}`);
      }

      toast({ title: 'Welcome to Learn Live!', description: 'Your family is set up.' });

      navigate('/dashboard');

    } catch (error: any) {
      toast({ title: 'Setup failed', description: error.message, variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
             <span>Welcome</span>
             <span>Family</span>
             <span>Learners</span>
             <span>Topic</span>
             <span>Ready</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 border-r border-background/20 last:border-0 transition-colors duration-300 ${i < step ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="flex-grow flex flex-col"
            >
              {step === 1 && (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-8 space-y-6">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-4xl">🌍</span>
                   </div>
                   <CardTitle className="text-3xl">Welcome to Learn Live!</CardTitle>
                   <CardDescription className="text-lg max-w-md">
                     We're excited to have you. Let's get your family set up so you can start exploring African History together.
                   </CardDescription>
                </div>
              )}

              {step === 2 && (
                <div className="flex-grow p-8 space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Create your family</CardTitle>
                    <CardDescription>Give your family a name to group your learners.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                     <div className="space-y-2">
                       <Label htmlFor="familyName">Family Name</Label>
                       <Input
                         id="familyName"
                         placeholder="e.g. The Smiths, Jackson Family"
                         value={familyName}
                         onChange={(e) => setFamilyName(e.target.value)}
                         autoFocus
                       />
                     </div>
                  </CardContent>
                </div>
              )}

              {step === 3 && (
                <div className="flex-grow p-8 flex flex-col max-h-[60vh] overflow-y-auto">
                  <CardHeader className="px-0 pt-0 shrink-0">
                    <CardTitle>Add Learners</CardTitle>
                    <CardDescription>Add the children who will be learning.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6 flex-grow">
                     {learners.map((learner, index) => (
                       <div key={learner.id} className="relative p-4 border rounded-lg bg-secondary/20 space-y-4">
                         {learners.length > 1 && (
                           <Button
                             variant="ghost"
                             size="icon"
                             className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                             onClick={() => removeLearner(learner.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         )}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label>Learner Name</Label>
                             <Input
                               placeholder="Name"
                               value={learner.name}
                               onChange={(e) => updateLearner(learner.id, 'name', e.target.value)}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label>Birth Date</Label>
                             <Input
                               type="date"
                               value={learner.birthDate}
                               onChange={(e) => updateLearner(learner.id, 'birthDate', e.target.value)}
                             />
                           </div>
                         </div>
                         {learner.birthDate && (
                           <div className="text-sm bg-primary/10 text-primary px-3 py-2 rounded-md flex items-center justify-between">
                             <span>Suggested Level: <strong>{calculateBand(new Date(learner.birthDate)).label}</strong></span>
                             <Badge>Band {learner.suggestedBand}</Badge>
                           </div>
                         )}
                       </div>
                     ))}
                     <Button type="button" variant="outline" onClick={addLearner} className="w-full border-dashed">
                       <Plus className="mr-2 h-4 w-4" /> Add another learner
                     </Button>
                  </CardContent>
                </div>
              )}

              {step === 4 && (
                <div className="flex-grow p-8 flex flex-col h-[60vh]">
                  <CardHeader className="px-0 pt-0 shrink-0">
                    <CardTitle>Choose a Starting Point</CardTitle>
                    <CardDescription>Select a topic to start exploring right away.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 flex-grow overflow-y-auto pr-2">
                    {loadingTopics ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {topics.map(topic => (
                           <div
                             key={topic.id}
                             className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedTopicId === topic.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                             onClick={() => setSelectedTopicId(topic.id)}
                           >
                             <h4 className="font-semibold text-sm mb-1">{topic.title}</h4>
                             <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                           </div>
                         ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              )}

              {step === 5 && (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-8 space-y-6">
                   <div className="w-20 h-20 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="h-10 w-10" />
                   </div>
                   <CardTitle className="text-3xl">You're all set!</CardTitle>
                   <CardDescription className="text-lg max-w-md">
                     Your family <strong>{familyName}</strong> is ready.
                     We've added {learners.length} learner{learners.length !== 1 && 's'}. Let's dive in!
                   </CardDescription>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <CardFooter className="border-t bg-muted/20 p-4 flex justify-between shrink-0">
             <Button
               variant="ghost"
               onClick={prevStep}
               disabled={step === 1 || isSubmitting}
               className={step === 1 ? 'invisible' : ''}
             >
               <ArrowLeft className="mr-2 h-4 w-4" /> Back
             </Button>

             {step < totalSteps ? (
               <Button onClick={nextStep}>
                 Next <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             ) : (
               <Button onClick={handleFinish} disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
