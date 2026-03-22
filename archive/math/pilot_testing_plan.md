# Learn Live: Band 2 Pilot Testing Plan & Documentation

***Target:*** 5–10 families with children aged 6–9 (Band 2).
***Focus:*** Validity of the Repetition Arc, Parent Competence using Constraint Templates, and Async AI Evidence Capture reliability.

---

## Part 1: Pilot Family Onboarding Guide

### Welcome to Learn Live
Thank you for participating in the Learn Live pilot! We are building an educational tool that puts *you*—the parent—back in the center of your child’s formation. Learn Live uses AI not as a teacher, but as an "Evidence Witness" to help you ensure your child is truly mastering concepts through physical, real-world tasks.

### Your Role
For the next two weeks, you will guide your child through **Strand 1: Number & Quantity**.
You are not expected to be a math expert. The app will provide you with a **"Constraint Prompt"** for each task. It tells you exactly:
1. What materials to grab (e.g., beans, paper, rocks).
2. What to ask your child to do.
3. What success looks like.
4. What specific reasoning question to ask them.

### The Daily Flow (10-15 minutes)
1. **Open the App:** Check the "Command Center" for your child's active tasks.
2. **Review the Prompt:** Read the instructions before bringing your child in.
3. **Execute the Task:** Sit with your child and ask them to perform the physical task.
4. **Capture Evidence:** Use the app to take a photo of the completed work. Then, record a quick 10-second audio clip of your child explaining *why* they did what they did.
5. **Review AI Draft:** The app will send this evidence to our AI, which will draft a quick report based on the rules. You read it, agree or disagree, and click "Approve" (advances them) or "Require Revision" (keeps them on this step).

### Important Rules
- **Do not do the work for them.** If they struggle, let them struggle. Ask guiding questions, but don't move the beans yourself.
- **Failures are good.** If they fail a task, that is necessary data. Hit "Require Revision." The system will adjust.
- **Encounter = Physical.** Ensure the first time they see a concept, it is done with physical objects, not just talking.

---

## Part 2: Calibration Metrics & Feedback (For the Engineering Team)

During this pilot, we need to quantitative and qualitative data to tune the `math_curriculum_spine.md`.

### 2.1 Repetition Arc Calibration
*   **Metric 1.1: Execution Fatigue.** Are the required number of "Execution" steps (e.g., 5 repetitions) too many or too few? 
    * *Data to gather:* Average time spent in Execution phase vs. Parent dropout rate.
*   **Metric 1.2: Endurance Noise.** When we inject "noise" (distractions) into the Endurance tasks, do children freeze, or do they successfully filter it out?
    * *Data to gather:* Pass/fail rate on Endurance tasks compared to Execution tasks. A massive drop-off means the noise is too jarring.
*   **Metric 1.3: Milestone Transfer.** Can children successfully complete the unlabelled Milestone task without the parent using the specific vocabulary (e.g., "counting", "adding")?
    * *Data to gather:* Success rate on Milestone tasks. If this is low, the Execution repetitions aren't building true 'Ownership'.

### 2.2 Async AI Evidence Reliability Testing
*   **Metric 2.1: Environmental Audio Quality.** How often does the AI fail to transcribe the 10-second explanation due to background noise (e.g., siblings, television, outdoor wind)?
    * *Action:* Tag all failed transcriptions and review audio manually to adjust AI `temperature` or prompt instructions regarding noise tolerance.
*   **Metric 2.2: Visual Recognition.** Can the AI accurately count beans, sticks, or interpret a child's crude drawing from a standard smartphone photo?
    * *Action:* Compare AI's "Confidence Score" against human review of the photos. If confidence is consistently low, we may need to prompt parents to take overhead, clearly lit photos.

---

## Part 3: Parent Competence Evaluation

At the end of Week 1 and Week 2, pilot parents must complete this brief interview/survey:

1. **Prompt Clarity:** Did you ever feel confused by what the "Success Condition" or "Failure Condition" was asking you to look for? If yes, which task?
2. **Math Anxiety:** On a scale of 1-5, how intimidating did the tasks feel to you as the guide?
3. **Reasoning Checks:** When you asked the specific "Reasoning Check" question, did your child's answer generally match what the AI determined? 
4. **Friction:** What was the most annoying part of capturing the photo and audio evidence?
5. **Parent Primers (Band 3 Preview):** *[Show them a short Band 3 primer on fractions]* Is this too dense? Does reading this make you feel equipped to judge a fraction task?
