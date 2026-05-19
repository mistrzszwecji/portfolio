/* =============================================================
   CONTENT.JS - All editorial text for the portfolio page

   Editing rules:
   · **bold text**       → renders as <strong>bold text</strong>
   · Enter (line break)  → renders as <br> in the browser
   · No line break       → text wraps naturally with the column width
   ============================================================= */

const COPY = {

  /* -- HERO ---------------------------------------------------- */

  "hero-subtitle": `Lead Product Designer, 15+ years of experience`,

  "hero-body": `Shipped AI features to enterprise SaaS teams. Built e-commerce tools for 600+ active sellers. **I lead design for organizations that want to modernize** - not rebuild. Done it twice: AI layered into a mature enterprise platform, and a legacy product elevated to a standard the team didn't think achievable without starting over.`,

  /* -- SHARED LABELS (used across all cases) ------------------- */

  "label-the-problem":     `The Problem`,
  "label-the-opportunity": `The Opportunity`,
  "label-the-decision":    `The Decision`,
  "label-how-validated":   `How I validated`,
  "label-outcome":         `Outcome`,
  "label-what-learned":    `What I learned`,

  /* -- CASE 01 · INTRO ----------------------------------------- */

  "case01-intro-label": `Case 01 -`,
  "case01-intro-title": `AI That Acts
Before Problems
Happen`,

  "case01-intro-problem-body": `Organizations tracked dozens of strategic initiatives, but problems were only discovered when it was too late. Managers spent hours manually reviewing status. Milestone planning was guesswork. **The platform was reactive:** it showed what happened, not what would happen.`,

  "case01-intro-opportunity-body": `What if the platform didn't just track progress, but **actively helped users succeed?** Two features emerged as the highest-leverage bets: proactive risk detection and AI-generated milestone planning.`,

  "case01-intro-decision-body": `A dedicated AI page was the suggested direction, easier to build, easier to scope. I proposed **embedding insights into existing views** instead: pulling managers out of their workflow creates high risk of disengagement. I presented the rationale, CEO aligned. AI lives in Strategic Plan, Initiative Details, and My Page.`,

  /* -- CASE 01 · Proactive Insights · Section ----------------- */

  "case01-solution1-label": `Same feature, 3 locations -`,
  "case01-solution1-title": `Proactive
Insights`,
  "case01-solution1-desc":  `**Three entry points. Insights surface where the work already lives**, Strategic Plan for executives scanning across the portfolio, Initiative Details for managers reviewing specific projects, My Page for owners tracking their own commitments. No separate AI dashboard. No new habit to build.`,

  /* -- CASE 01 · Proactive Insights · CEO view ---------------- */

  "case01-ceo-label": `Strategic Plan -`,
  "case01-ceo-title": `CEO point of view`,
  "case01-ceo-intro": `The CEO opens Strategic Plan to scan 20+ initiatives. The question isn't "what happened?", it's "**what needs my attention right now?**"`,

  "case01-ceo-1": `**Sorted by severity, not by initiative name.** An alphabetical default would force the CEO to scan every row before knowing where to act, critical surfaces first, a clean row is itself a signal of no problem.`,
  "case01-ceo-2": `**Each card carries three layers instead of one status badge.** A single indicator would require opening the initiative to understand impact, three layers let the CEO act, delegate, or dismiss without leaving the view.`,
  "case01-ceo-3": `**Risk badges appear on exception only, no badge is good news.** Showing status on every row would flatten the signal; only what demands attention is marked, everything else reads as healthy.`,
  "case01-ceo-4": `**Progress bar and health badge encode two separate questions deliberately.** The obvious shortcut, one color for both, would make red ambiguous: behind schedule, at risk, or both. Splitting them removes that guesswork.`,

  /* -- CASE 01 · Proactive Insights · Manager view ------------ */

  "case01-manager-label": `Initiative Details -`,
  "case01-manager-title": `Manager
point of view`,
  "case01-manager-intro": `The manager opens Initiative Details to review a specific project. The question isn't "what's in here?", it's **"what needs action on this initiative?"**`,

  "case01-manager-1": `**Insights appear inline, not in a sidebar panel.** The manager reads the initiative and sees risks in the same flow. No tab switching, no separate AI mode, the information is where the work is.`,
  "case01-manager-2": `**Risk flags appear at milestone level.** CEO view shows initiative-level health. Manager view goes deeper, which milestone is at risk, and why. Same feature, higher resolution.`,
  "case01-manager-3": `**Suggested actions are specific to the initiative's state.** Not generic advice, the system reads the current milestone status and surfaces the most relevant next action for this manager, on this initiative, right now.`,

  /* -- CASE 01 · Proactive Insights · Owner view -------------- */

  "case01-owner-label": `My Page -`,
  "case01-owner-title": `Owner point
of view`,
  "case01-owner-intro": `The owner opens My Page to track their own commitments. **Personal accountability without portfolio noise**, only what belongs to them.`,

  "case01-owner-1": `**Filtered to the owner's own initiatives only.** No org-wide feed, no noise from parallel workstreams. The signal-to-noise ratio is the point, My Page is where individuals understand their own risk exposure.`,
  "case01-owner-2": `**Personal risk alerts, not org-wide alerts.** The CEO sees everything. The owner sees what they are accountable for. Same underlying model, different scope, the context determines what surfaces.`,
  "case01-owner-3": `**Act directly from My Page.** No navigation to Initiative Details required for common actions. The most frequent response, acknowledge, update status, flag to manager, is available inline.`,

  /* -- CASE 01 · AI Milestone Planner · Section --------------- */

  "case01-solution2-label": `Second solution -`,
  "case01-solution2-title": `AI Milestone
Planner`,
  "case01-solution2-desc":  `Generates structured milestone roadmaps for strategic initiatives, **turning a goal description into an actionable plan.** Existing milestones preserved; only new milestones are generated. User reviews and edits before anything is committed to the platform. The critical design challenge wasn't AI capability, it was trust. Enterprise users are accountable to their organizations for execution outcomes. AI must support their judgment, not substitute it.`,

  /* -- CASE 01 · AI Milestone Planner · STEP 1 ---------------- */

  "case01-step1-label": `STEP 1: Context before questions -`,
  "case01-step1-title": `AI reads the room`,
  "case01-step1-intro": `The manager describes a goal in plain language. In seconds, the platform returns a structured milestone roadmap, ready to review, edit, and confirm. No templates, no forms.`,

  "case01-step1-1": `**AI shows its starting point first:** Before asking anything, the system surfaces what it already extracted, purpose, goal, gaps. User isn't repeating themselves. Trust established before the first input.`,
  "case01-step1-2": `**Three entry paths, no forced sequence:** Share rough ideas, answer questions, or generate immediately and refine later. Early version required 5 sequential answers, felt like a form. Removed the forced path to match how people actually plan.`,
  "case01-step1-3": `**Understanding Level:** Real-time score across Goal Clarity, Coherence, Timeline Realism. Not a gate, generate at any point. Shows why the plan might be weak, not just that it is.`,

  /* -- CASE 01 · AI Milestone Planner · STEP 2 ---------------- */

  "case01-step2-label": `STEP 2: Conversation shapes the plan -`,
  "case01-step2-title": `Refinement
in real time`,
  "case01-step2-intro": `The AI doesn't wait for perfect input, it asks. Targeted questions based on what was already shared, until there's enough context to build a solid plan.`,

  "case01-step2-1": `**Adaptive conversation, not a checklist:** AI asks targeted clarifications based on what was shared. No fixed sequence, conversation continues until there's enough context to build a solid plan.`,
  "case01-step2-2": `**Question rationale is visible:** "This helps me structure milestones, info-heavy vs. engagement-focused plans look different." The AI shows its reasoning before asking. One sentence that turns a black box into a collaborator.`,
  "case01-step2-3": `**Generate always available:** User decides when enough is enough, no forced completion, no minimum threshold to unlock generation.`,

  /* -- CASE 01 · AI Milestone Planner · STEP 3 ---------------- */

  "case01-step3-label": `STEP 3: Review before you commit -`,
  "case01-step3-title": `Review, refine, save`,
  "case01-step3-intro": `The plan is ready. Full-page workspace, chat on the left, milestone cards on the right. Generation is the beginning of the conversation, not the end.`,

  "case01-step3-1": `**Existing and new milestones clearly separated:** Color-coded, new ones numbered. User sees exactly what AI generated vs what was already there, no surprises, no silent overwrites.`,
  "case01-step3-2": `**AI flags issues before saving:** Overdue milestone triggers a sidebar warning and a validation bar at the bottom. Plan can't be saved until resolved, AI acts as a quality gate, not just a generator.`,
  "case01-step3-3": `**Chat persists as a refinement tool:** "What can I change?" stays available throughout. The conversation shifts goal, from creation to collaboration.`,

  /* -- CASE 01 · OUTCOMES ------------------------------------- */

  "case01-summary": `Summary`,

  "case01-outcome2-body": `AI Milestone Planner shipped to production after **five design iterations** over three months. AI Insights completed design and entered the development pipeline during my tenure. Three **enterprise clients requested beta access** before public release, the strongest indicator a feature solves a real problem.`,

  "case01-outcome1-body": `No hour-long research sessions. **Pre-read sent upfront, 15-minute focused conversation** on the most important points. Higher show rate, more honest signal. It worked because of who I was testing with, high-level managers don't do extended research sessions.`,

  "case01-outcome3-body": `**Managers don't resist AI, they resist losing authorship.** The shift that unlocked adoption: reframing every feature from "AI decides" to "AI drafts, you approve." Every design decision in this case traces back to that principle.`,

  /* -- CASE 02 · INTRO ----------------------------------------- */

  "case02-intro-label": `Case 02 -`,
  "case02-intro-title": `Inherited\na Patchwork.\nShipped\na System.`,

  "case02-intro-problem-body": `The platform had been built by engineers. Ant Design components with layers of custom overrides stacked on top. No design system, no documentation, no consistent visual language. Buttons had multiple styles. Colors weren't systematized. It wasn't clear what was interactive and what wasn't.`,

  "case02-intro-opportunity-body": `A design system wouldn't just fix the visual debt, it would make every future feature faster to build and easier to QA. The platform needed a foundation before it could be redesigned.`,

  "case02-intro-decision-body": `System first. Redesigning without a foundation would mean redesigning again in six months. I built the design system, got engineering aligned, and redesigned on top of it. QA was measured against system compliance, not subjective review.`,

  /* -- CASE 02 · Platform Overhaul · Section ------------------ */

  "case02-solution1-label": `The Platform Overhaul -`,
  "case02-solution1-title": `Everything\nrebuild.\nNothing Broken.`,
  "case02-solution1-desc": `**Design system, visual language, and information architecture built from zero**, shipped as a coherent system update. The navigation alone recovered critical horizontal space for 1280px users while introducing a role-based IA that mapped to how the organization actually worked.`,

  "case02-nav-before-label": `What I inherited`,
  "case02-nav-after-label":  `Design system implemented`,
  "case02-nav-before-caption": `Sidebar eats ~130px fixed, at 1280px that's 10% of horizontal space gone before content starts. Flat structure, no role signal. Company, Why, Teams, My Reports in one undifferentiated list; **hierarchy implied, never shown.**`,
  "case02-nav-after-caption":  `Full horizontal width recovered. Content reaches edge to edge without competing with navigation. **Role-based hierarchy, Company / Team / My Page maps directly to org structure; your context is always visible.**`,

  /* -- CASE 02 · Initiatives module · Section ----------------- */

  "case02-solution2-label": `The Initiatives Module -`,
  "case02-solution2-title": `New core,\ntested,\npivoted`,
  "case02-solution2-desc": `The Initiatives module became the structural **backbone of the entire platform**, connecting company goals to team execution to individual daily work. Designed from scratch, validated through user interviews I designed and ran, and fundamentally pivoted based on what the evidence revealed. **The first version was built on a reasonable assumption:** if you give teams ownership over their own initiatives, engagement follows. It tested well on usability. What it didn't account for was organizational dynamics, the gap between how enterprise companies want to work and how they actually make decisions.`,

  "case02-initiatives-v1-title": `Bottom-up,\ncross-team engagement`,
  "case02-initiatives-v1-body": `Teams propose and shape their own initiatives. Collaborative emergence from the ground up, designed to give ownership at execution level and reduce top-down pressure on goal-setting. **Aligned with product vision of empowering individual contributors.**`,

  "case02-initiatives-v2-title": `Top-down structure,\nteam execution`,
  "case02-initiatives-v2-body": `Enterprise management needed tools to set structure from above and cascade goals downward. Teams engage at execution level, not at initiative definition. **The original assumption conflicted with how organizations actually operate:** management wants control over structure, teams want ownership over delivery. Not a UI change.\nA product architecture decision made from user evidence, the module was redesigned from the model up, not from the interface down.`,

  /* -- CASE 02 · OUTCOMES ------------------------------------- */

  "case02-summary": `Summary`,

  "case02-outcome1-body": `Design system, platform redesign, and Initiatives V2, all shipped and in active use through the end of my tenure. **The pivot from V1 to V2 wasn't a failure:** it was a hypothesis tested, confirmed, and acted on. The platform needed a foundation before it could evolve. The design system made that possible.`,

  "case02-outcome2-body": `Initiatives V1 was tested with real clients, usability sessions I designed, moderated, and analyzed. Usability was positive. **The larger group test revealed the gap**: not a UI problem, but an organizational one. The evidence was clear enough to justify a full architectural pivot.`,

  "case02-outcome3-body": `V1 was **good design built on a wrong assumption** about human behavior. I flagged the adoption risk early, that people simply wouldn't engage with a bottom-up model. The data confirmed it. What I would have added: comments and change history inside Initiatives. Async communication would have made the module sticky in a way that structure alone couldn't.`,

  /* -- CASE 03 · INTRO ----------------------------------------- */

  "case03-intro-label": `Case 03 -`,
  "case03-intro-title": `Designed
for people
that don't
design.`,

  "case03-intro-problem-body": `Tools were built around the order of development, not around how sellers actually work. Options were buried or oversized, with no visual hierarchy to guide decisions. Users with no design background were missing capabilities they needed, or overwhelmed by ones they didn't. **The platform had grown by accretion, not by intent.**`,

  "case03-intro-opportunity-body": `600+ active sellers, influencers, creators, small brands, all depending on the creator as their primary business tool. These weren't casual users: they were running stores, fulfilling orders, building brands. **The product had the capabilities. It just didn't feel like it.**`,

  "case03-intro-decision-body": `Before opening Figma, I audited 15+ competitors, Printful, Printify, Gelato, and smaller players. The key insight: most platforms were built for personal use. Subliminator's model was different. Sellers designed products their own customers would buy. The challenge wasn't adding features, **it was making a professional-grade toolset feel approachable** to someone who had never opened Photoshop.`,

  /* -- CASE 03 · Creator tool · Section ----------------------- */

  "case03-solution1-label": `The creator -`,
  "case03-solution1-title": `Professional tools.
Zero learning curve.`,
  "case03-solution1-desc":  `The canvas engine already had the capabilities, multi-layer editing, full typography control, print quality validation. The design challenge was making those capabilities **legible to someone running a business, not designing for a living.** Contextual panels, progressive disclosure, and inline feedback eliminated the need for onboarding.`,

  "case03-creator-label": `Garment creator -`,
  "case03-creator-title": `The design
workspace`,
  "case03-creator-intro": `A multi-layer canvas with context-aware panels. **The sidebar adapts to the selected layer**, no mode switching, no cognitive load of navigating between tool modes.`,

  "case03-creator-1": `**Contextual panel adapts to selection.** Image layer shows Object settings, text layer shows Text settings. No mode switching, the tool reads intent from what the user is working on.`,
  "case03-creator-2": `**Print quality indicator inline.** "Good quality (320 DPI)" appears with the layer, a non-designer knows immediately if their upload will print well. No separate check required.`,
  "case03-creator-3": `**Multi-layer canvas.** Image and text as independent layers, each editable, movable, and lockable separately. Visible stacking order. Sellers build complex designs without a design background.`,
  "case03-creator-4": `**Full typography control, legibly organized.** Font, size, color, line height, letter spacing, alignment, rotation, professional-level controls made approachable through grouping and progressive disclosure.`,

  /* -- CASE 03 · OUTCOMES ------------------------------------- */

  "case03-summary": `Summary`,

  "case03-outcome2-body": `Everything shipped, garment creator, seller dashboard, sales flows, product views, design system. **600+ active sellers** on the platform at the end of my tenure. Designed for people who run businesses, not for people who design.`,

  "case03-outcome1-body": `The seller community was the feedback engine. **Real users, real stores, real friction points** surfaced continuously. No formal research sessions needed, the product was small enough that sellers talked directly. Feedback cycles were fast.`,

  "case03-outcome3-body": `This was my **first encounter with AI in product design.** Sellers couldn't describe their own products. AI-generated descriptions solved a confidence problem, not just an efficiency one. Four years before it became obvious, the pattern was already there: AI works best when it removes the blank page, not when it replaces the person.`,

  /* -- SELECTED WORKS ------------------------------------------ */

  "label-role":   `Role`,
  "label-scope":  `Scope`,
  "label-status": `Status`,

  "card-svensk-tag":    `Consumer Health · Mobile App`,
  "card-svensk-title":  `Svensk\nProvtagning`,
  "card-svensk-body":   `Full redesign of a Swedish consumer health app for private blood testing. The core challenge: translating complex medical markers - hormones, organ function, blood fats, immune system - into a UI legible to non-clinical users acting on their own results. Shipped on Android and iOS.`,
  "card-svensk-role":   `Lead Product Designer`,
  "card-svensk-scope":  `Full app redesign · Android + iOS`,
  "card-svensk-status": `Shipped · Live on App Store`,

  "card-loan-tag":    `Design Systems · Enterprise`,
  "card-loan-title":  `Comarch Loan\nOrigination`,
  "card-loan-body":   `B2B desktop system for loan management at financial institutions, and the first product to pilot Comarch's unified design language across the entire company. Built a full design system from the ground up, evolving it continuously as the first live test of a component library that would eventually serve all Comarch products. Final phase: preparing the library for UX designers across teams and overseeing their work for consistency.`,
  "card-loan-role":   `Lead Designer · Design system + UI`,
  "card-loan-scope":  `Desktop · enterprise B2B`,
  "card-loan-status": `Shipped · Comarch-wide design language pilot`,

  "card-banking-tag":    `Mobile Concept · Fintech`,
  "card-banking-title":  `Comarch Mobile\nBanking`,
  "card-banking-body":   `Mobile banking concept for Comarch's white-label platform. Key feature: counterparty recognition via GPS and account history, invoice creation in seconds. 1-click expense financing for insufficient funds. Well-received at fintech conference. Not shipped.`,
  "card-banking-role":   `Product Designer · UX + UI`,
  "card-banking-scope":  `Mobile app concept · iOS`,
  "card-banking-status": `Conference demo · not shipped`,

  "card-sleeper-tag":    `Consumer Health · Mobile App`,
  "card-sleeper-title":  `Good Sleeper`,
  "card-sleeper-body":   `UI design and information architecture for a Polish digital CBT-I app, translating clinical sleep therapy into a calm, non-stimulating mobile experience. Designed data visualization for sleep tracking, session structure, and symptom reporting. Shipped on iOS.`,
  "card-sleeper-role":   `Product Designer · UI + IA`,
  "card-sleeper-scope":  `Mobile app · iOS`,
  "card-sleeper-status": `Shipped`,

  /* -- ABOUT --------------------------------------------------- */

  "about-statement": `I join products with history\nand make them excellent.`,

  "about-body1": `Fifteen years of shipping product work across healthcare, enterprise SaaS, e-commerce, and fintech. What I do most: join organizations where the product exists, the constraints are real, and the job is to **elevate it - without starting over.** I've done it twice. AI features embedded into a mature enterprise platform. A full legacy product taken to a standard neither team thought achievable without a rebuild. Working with what exists isn't a compromise. **It's a different craft.**`,

  "about-body2": `AI is part of my daily workflow - I use Claude Code to build and prototype, I've built agents for design processes, and I run personal projects exploring where AI changes the craft and where it doesn't. The interest isn't new: Subliminator's AI-generated descriptions in 2020, four years before it was obvious. Over time I moved from executing to leading design teams, and **I still do the work myself** - leadership means raising the quality ceiling for the whole team, not leaving the craft behind.`,

};
