# **Learn Live: Master Blueprint & Hackathon Strategy**

**Version:** 1.0 (Draft) **Target:** Gemini Live Agent Challenge 2026 (Category: Live Agents)

## **TABLE OF CONTENTS**

### **I. EXECUTIVE SUMMARY & VISION**

* **The Core Mission:** Educational sovereignty, discipleship, and economic growth for families.  
* **The Paradigm Shift:** Moving from AI as a "Teacher/Tutor" to AI as a "Steward of Structure" and "Evidence Witness."  
* **The End Goal:** Forming faithful, capable, and responsible adults, starting in the African homeschooling context.

### **II. THE PROBLEM & THE TARGET MARKET**

* **The Target Persona:** The intentional, faith-rooted parent-educator (with a focus on African families and global homeschoolers).  
* **The Core Pain Points:** \* Lack of structured, high-quality, and culturally aligned formative tasks.  
  * The overwhelm of planning and evaluating true progress (beyond arbitrary grades).  
  * The danger of modern ed-tech (gamification, loss of parental authority, shallow AI usage).  
* **The Environmental Constraints:** Low-bandwidth realities, device sharing, and cost sensitivity.

### **III. THE PEDAGOGICAL FOUNDATION (The "How" of Formation)**

* **Authority & Jurisdiction:** Parents as the final human authority; AI strictly subordinate.  
* **Tasks as the Unit of Curriculum:** Shifting from "content consumption" to "responsibility execution."  
* **Habit Through Repetition:** The necessity of volume, friction, and difficulty in forming character.

### **IV. HACKATHON ALIGNMENT: THE GEMINI LIVE AGENT**

* **Category Selection:** Live Agents (Real-time Audio/Vision Interaction).  
* **The "Evidence Witness" Feature:** Breaking the text-box paradigm using Gemini's multimodal capabilities (Vision \+ Voice) to enforce physical and verbal constraints.  
* **Meeting the Mandatory Tech:** Google GenAI SDK / ADK hosted on Google Cloud, utilizing interleaved visual and verbal reasoning.

### **V. SYSTEM ARCHITECTURE & TECH STACK**

* **Frontend (The Interface):** React, Vite, Tailwind (Dark mode, distraction-free), hosted on Cloudflare Pages.  
* **Backend (The Agent Engine):** Google Cloud Run (Node.js/Python) bridging the Gemini Live API.  
* **Database & Storage (The Matrix & Memory):** Cloudflare D1 (Relational Data), Vectorize (if needed for semantic matching), and Cloudflare R2 (Evidence/Portfolio storage).

### **VI. THE RESPONSIBILITY MATRIX (The Curriculum Spine)**

* **The 3-Dimensional Data Model:** \* *X-Axis (Arenas of Strain):* Accommodating learner differences (Analytical, Artistic, Stewardship) without lowering standards.  
  * *Y-Axis (Capacity Tracks):* Moving from observation to abstract mastery (Levels 1-4).  
  * *Z-Axis (The Repetition & Volume Arc):* Exposure (1x) \-\> Execution (5x) \-\> Endurance (3x) \-\> Milestone (1x).  
* **The JSON Cell Structure:** How the database feeds constraint instructions to the Gemini Live Agent.

### **VII. CORE USER FLOWS & EXPERIENCE**

* **The Parent Dashboard:** Organizing active tasks, stalled tasks, and reviewing AI-gathered evidence. Authorizing advancement.  
* **The Learner Interface (Azie & Arie's View):** Spartan, distraction-free execution. Hitting a button to summon the "Evidence Witness" via camera/mic.  
* **The AI Interaction Loop:** AI observes \-\> AI enforces constraints \-\> AI prompts revision or accepts evidence \-\> AI logs to portfolio.

### **VIII. HACKATHON MVP SCOPE (The Vertical Slice)**

* **Chosen Domain:** Language & Literacy (Narrative Sequencing & Oral Narration).  
* **Demo Scenario:** Showcasing two learners on different gradients (e.g., Arie at Level 1, Azie at Level 2\) using the same system.  
* **Hackathon Deliverables Checklist:**  
  * Demo Video Script (Under 4 mins).  
  * Architecture Diagram.  
  * Proof of Google Cloud Deployment.  
  * Public Code Repository with Spin-up Instructions.

### **IX. FUTURE ROADMAP (Post-Hackathon)**

* Expanding the Domains (Quantitative Reasoning, Physical World, etc.).  
* Opening the ecosystem for other families to create and sell resources.  
* Deepening the longitudinal portfolio capabilities.

*(End of Table of Contents \- Sections to be expanded iteratively)*

## **I. EXECUTIVE SUMMARY & VISION**

### **The Core Mission**

Learn Live is not just an app; it is a generational infrastructure project. The core mission is to provide families—especially within the African homeschooling context—with absolute educational sovereignty, robust tools for discipleship, and platforms for economic growth. We believe that education is inherently moral, directional, and formative. Therefore, we are building a system that serves family-centered economies, starting at home and rippling outward to bless others.

### **The Paradigm Shift: AI as "Steward of Structure"**

Modern ed-tech is fundamentally misaligned with true human formation. It asks, *"How can AI teach students better?"* and builds gamified AI tutors that bypass parental authority, remove necessary friction, and confuse intelligence with maturity.

Learn Live introduces a paradigm shift: **AI is an instrument, not an agent.** It possesses no moral authority and cannot replace the parent. Instead, we utilize multimodal AI (vision and voice) as an **"Evidence Witness"** and a **"Steward of Structure."** The AI does not teach meaning; it enforces form, rhythm, constraints, and consequence. It watches a child complete a physical task, listens to their verbal reasoning, and logs the evidence for the parent to judge.

### **The End Goal**

Our end goal is not to produce children who can pass standardized tests, but to form faithful, capable, and responsible adults. Inspired by the need to raise godly children in our own homes (like Azie and Arie), Learn Live is built to scale this reality for the global, faith-rooted homeschooling movement.

## **II. THE PROBLEM & THE TARGET MARKET**

### **The Target Persona**

Our primary user is the **Intentional, Faith-Rooted Parent-Educator**. They are not looking for a digital babysitter. Whether they are part of the growing movement of African homeschoolers or the broader global Christian classical community, these parents want a rigorous, biblical worldview for their children. They are deeply invested in character formation but are often not formally trained as teachers.

### **The Core Pain Points**

1. **Lack of Structured, Culturally Aligned Tasks:** Imported curricula are often expensive, culturally misaligned, or heavily dependent on constant parental supervision. Parents lack a system that provides structured, progressively difficult, high-quality formative tasks that can be sustained over years.  
2. **The Overwhelm of Evaluation:** Parents struggle to track true progress. They don't know whether a child is actually growing in responsibility or just coasting. Traditional tests feel shallow, and parents need a way to track *patterns of behavior* (work ethic, revision, endurance) rather than arbitrary grades.  
3. **The Danger of Modern Ed-Tech:** Parents rightfully fear AI "cheating" and the loss of their own authority. Current platforms isolate the child from the parent and optimize for shallow engagement rather than deep formation.

### **The Environmental Constraints**

To serve the African context (and to remain lean and scalable globally), Learn Live must operate within specific realities:

* **Cost Sensitivity & Bandwidth:** Tools must be affordable and data-efficient. The architecture relies on edge-first simplicity (Cloudflare) for the heavy lifting, only invoking powerful Google Cloud multimodal AI calls during specific, intentional "Evidence Witness" moments to keep costs and data usage low.  
* **Device Sharing:** Families often share a single tablet or phone. The system must support seamless switching between a Parent Dashboard and Spartan, distraction-free Learner Interfaces for multiple children of varying ages.

## **III. THE PEDAGOGICAL FOUNDATION (The "How" of Formation)**

### **Authority & Jurisdiction**

Education requires authority, but authority must be personal, accountable, and morally grounded. Parents hold the non-transferable responsibility for their child’s education. Learn Live, and the AI within it, operates only by delegation. The system enforces structure, but only the human parent exercises judgment. AI is explicitly forbidden from generating grades, declaring mastery, or auto-advancing a student without parental review.

### **Tasks as the Unit of Curriculum**

We are shifting the unit of education away from "lessons" (content consumption) to **"tasks" (responsibility execution)**. A task is defined as a bounded responsibility with explicit constraints, requiring sustained effort, and producing an observable outcome. Learn Live does not exist to explain concepts endlessly; it exists to present a task, enforce the constraint, and witness the completion.

### **Habit Through Repetition & Constraint**

Growth occurs through rightly ordered constraint, not unrestricted self-expression. Formation requires discipline, order, repetition, and accountability. Therefore, tasks within Learn Live are not one-off events. They are built on an arc of volume: **Exposure (1x) → Execution (5x) → Endurance (3x) → Milestone (1x)**. The system intentionally retains friction to build resilience, time sensitivity, and work ethic.

## **IV. HACKATHON ALIGNMENT: THE GEMINI LIVE AGENT**

### **Category Selection: Live Agents**

Learn Live is targeting the **Live Agents (Real-time Interaction)** category. The challenge mandates breaking the "text box" paradigm and creating an immersive experience that can "see, hear, and speak."

### **The "Evidence Witness" Feature**

We are using the Gemini Live API to create the "Evidence Witness." Instead of a child staring at a screen, the child completes a physical task in the real world (e.g., sorting blocks, drawing a sequence, cleaning a room). When finished, they tap a button on the shared family device.

* **Vision:** The Gemini Live Agent opens the camera and "sees" the physical outcome of the task, evaluating it against the strict constraints provided by the database.  
* **Voice:** The agent engages the child in a natural, interruptible conversation, asking them to verbally explain their reasoning (e.g., "Azie, I see your blocks. Why did you put the red one first?").  
* **Outcome:** The multimodal interaction is logged to the child's portfolio as hard evidence of formation, completely eliminating AI hallucinations because the AI isn't tasked with "teaching facts"—it is tasked with verifying a physical/verbal constraint.

### **Meeting the Mandatory Tech Requirements**

* **Google Cloud Hosting:** The agent logic and WebSocket connections to the Gemini Live API will be strictly hosted on Google Cloud Run, satisfying the requirement that the backend runs on GCP.  
* **GenAI SDK / ADK:** We will utilize the official Google GenAI SDK (or Agent Development Kit) to handle the bidirectional audio and video streaming.

## **V. SYSTEM ARCHITECTURE & TECH STACK**

To maintain a lean, globally accessible, and highly scalable platform that respects African bandwidth constraints while delivering cutting-edge AI, Learn Live utilizes a hybrid Cloudflare and Google Cloud architecture.

### **Frontend (The Interface)**

* **Stack:** React, Vite, and Tailwind CSS.  
* **Design:** Clean, fullscreen layouts, modern aesthetics, and strictly dark-mode interfaces to minimize distraction. The Learner UI is "Spartan"—showing only the active task and the camera/mic button.  
* **Hosting:** Cloudflare Pages for lightning-fast, edge-cached delivery worldwide.

### **Backend (The Agent Engine)**

* **Stack:** Node.js or Python service hosted on **Google Cloud Run**.  
* **Function:** This isolated microservice acts as the secure bridge to the Gemini Live API. When a learner starts an "Evidence Witness" session, the React frontend connects to this Google Cloud Run service, which establishes the bidi-streaming connection with Gemini, feeding it the specific "System Instructions" dynamically fetched from the database based on the child's current task.

### **Database & Storage (The Matrix & Memory)**

* **Database:** **Cloudflare D1** (Serverless SQLite). D1 houses the "Responsibility Matrix" (the 3D curriculum spine mapping Arenas, Capacities, and Repetition Arcs) as well as the family relationships, user accounts, and task statuses.  
* **Vector Search:** **Cloudflare Vectorize** will be used if semantic matching is needed for parents to search the task matrix quickly based on natural language queries.  
* **Storage:** **Cloudflare R2**. When the Gemini Live Agent concludes an Evidence Witness session, the audio transcript, summary, and snapshot images are saved to an R2 bucket, forming the immutable Portfolio for the parent to review on their dashboard.

## **VI. THE RESPONSIBILITY MATRIX (The Curriculum Spine)**

To accommodate learner differences without lowering standards, the curriculum spine is not a flat list, but a 3-Dimensional matrix housed in Cloudflare D1.

### **The 3-Dimensional Data Model**

1. **X-Axis (Arenas of Strain):** The "flavor" of the task adapted to the child's leaning (e.g., Analytical, Artistic, Stewardship of Physical Labor).  
2. **Y-Axis (Capacity Tracks):** The specific domain skill being formed, stripped of arbitrary "grade levels" and mapped as Levels of Responsibility (L1, L2, L3).  
3. **Z-Axis (The Repetition Arc):** The volume constraint. A cell in the matrix represents an arc (1 Exposure, 5 Executions, 3 Endurances, 1 Milestone). The AI tracks how many times a task has been completed before allowing milestone attempts.

### **The JSON Cell Structure**

When a task is initiated, the database passes a strict JSON object to the Google Cloud Run backend, which acts as the `systemInstruction` for the Gemini Live Agent.

{  
  "task\_id": "LANG-SEQ-L2-ART-EXEC-03",  
  "domain": "Language & Literacy",  
  "capacity": "Narrative Sequencing",  
  "responsibility\_level": "L2",  
  "arena": "Artistic",  
  "arc\_stage": "Execution",  
  "ai\_system\_instructions": {  
    "role": "You are the Evidence Witness. You are speaking to 4-year-old Azie.",  
    "constraint\_to\_enforce": "Azie must retell a 3-part story based on the drawing he just made. Verify the drawing has 3 distinct elements. Ensure his verbal story has a beginning, middle, and end.",  
    "failure\_condition": "If he skips a part of the story, or if the drawing does not match the story, gently prompt him to revise his answer.",  
    "success\_condition": "If he succeeds, ask him what his favorite part to draw was, praise his effort, and end the session."  
  }  
}

## **VII. CORE USER FLOWS & EXPERIENCE**

### **The Parent Dashboard**

* **The Command Center:** Parents log in to see a high-level overview of their family account.  
* **Active vs. Stalled Tasks:** See exactly what Azie and Arie are supposed to be working on today.  
* **Evidence Review:** The AI does not grade. Instead, it flags Milestones as "Awaiting Judgment." The parent reviews the AI-captured snapshot and transcript, then clicks "Authorize Advancement" or "Require Revision."

### **The Learner Interface**

* **Distraction-Free:** No gamification, no points, no badges, no endless scrolling.  
* **The "Witness" Button:** The child sees their current active task. When they have completed the physical/mental work in the real world, they tap a single, prominent button.  
* **The AI Interaction Loop:** 1\. Camera and microphone open. 2\. Gemini Live greets the child and asks to see the work. 3\. The child holds up their work or verbally explains it. 4\. Gemini verifies the constraints, logs the interaction to Cloudflare R2, and closes the session.

## **VIII. HACKATHON MVP SCOPE (The Vertical Slice)**

To build a winning Devpost submission within the timeframe, we will build a "Vertical Slice" demonstrating one complete loop of the system for two different learners.

* **Chosen Domain:** Language & Literacy (Narrative Sequencing).  
* **Demo Scenario:** \* *Arie (Age 3, Level 1):* Uses the tablet camera to show the AI 3 physical picture cards he sorted, and verbally names what is happening in each.  
  * *Azie (Age 4, Level 2):* Sits in front of the tablet without visual aids and verbally reconstructs a story he heard earlier, answering the AI's constraint-checking questions.

### **Devpost Deliverables Checklist**

* \[ \] **Public Code Repository:** GitHub repo containing the React frontend and Node.js/Cloud Run backend.  
* \[ \] **Spin-up Instructions:** Detailed `README.md` explaining how the judges can deploy the worker and frontend.  
* \[ \] **Architecture Diagram:** Visual representation of Cloudflare Pages \-\> Google Cloud Run \-\> Gemini Live API \-\> D1/R2.  
* \[ \] **Proof of Cloud Deployment:** A link to a code file or a quick console screen recording proving the backend runs on GCP.  
* \[ \] **Demonstration Video (\<4 mins):** A video pitching the problem (modern ed-tech removes friction and parental authority) and showing real-time, uninterrupted multimodal interaction with the Live Agent (no mockups).  
* \[ \] **Bonus Points Strategy:** Publish a quick blog post about building an African-centric, faith-rooted AI platform on Google Cloud and link your GDG profile.

## **IX. FUTURE ROADMAP (Post-Hackathon)**

1. **Expanding the Domains:** Build out the full matrix for Quantitative Reasoning, The Physical World, and Moral & Social Formation.  
2. **The Homeschool Marketplace:** Integrate an e-commerce layer (building on the HomeLine Academy vision) allowing other intentional families to create, share, and sell their own physical task kits and curriculum spines that plug into the Learn Live matrix.  
3. **Longitudinal Portfolios:** Enhance the R2 storage to generate beautiful, exportable "Years in Review" for children, documenting their character formation and intellectual growth over a decade, serving as a transcript of actual responsibility borne rather than arbitrary test scores.

