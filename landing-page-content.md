# Snapinfra Landing Page Content

## Hero Section

### Main Headline
**Enterprise infrastructure in one prompt.**

### Subheadline
Multi-tenant architecture. Database schemas. API layers. Security built-in.
Generated in minutes. Deployed to your cloud.

### Interactive Prompt Box
Placeholder text: "Describe your backend..."

### Code Editor Preview
Shows streaming code generation with:
- AI generating indicator
- TypeScript code preview
- File: auth.service.ts
- Status: Generating...

---

## ROI Calculator Section

### Title
Calculate Your Savings

### Description
Interactive calculator showing time and cost savings based on:
- Team size
- Project complexity
- Infrastructure type (IaC)
- Cloud provider (AWS, GCP, Azure, Multi-cloud)

### Outputs
- Time saved (hours)
- Cost saved ($)
- Comparison breakdown

---

## The $500K Backend Problem

### Section Title
**The $500K Backend Problem**

### Subtitle
Why every alternative is broken

### Problem 1: The No-Code Trap
**"We started with Firebase"**

- $30,000 surprise bill because one query went viral
- Can't do complex queries - NoSQL limitations hit hard
- Vendor lock-in nightmare - "Firebase doesn't provide any tools to migrate data"
- Supabase "doesn't support transactions yet" - blocked our product launch

**Stats:**
- 61,161 companies using Firebase
- 54% worried about lock-in

### Problem 2: The DevOps Nightmare
**"We tried building it ourselves"**

- Terraform takes 3-6 months to learn before shipping
- Kubernetes requires "an army of specialists" to manage
- CloudFormation's 15-minute feedback loops kill velocity
- "YAML hell" - endless config files nobody understands

**Stats:**
- 77% still struggle with K8s
- 70% onboarding takes 1+ month

### Problem 3: The Hidden Costs
**"Costs spiraled out of control"**

- Firebase's pay-per-read model becomes unsustainable
- Supabase's PITR backup: $100/month regardless of DB size
- "Empty EKS cluster costs are ridiculous" - baseline $150/mo
- AWS egress fees make migration financially painful

**Stats:**
- 54% face steep learning curves
- 89% use multi-cloud to avoid lock

### CTA Button
**There has to be a better way →**

---

## The Solution Section

### Section Title
**Infrastructure that thinks like code, feels like magic**

### Subtitle
We're the Goldilocks solution: Not too simple. Not too complex. Just right.

### Comparison Table

| What You Get | No-Code (Firebase/Supabase) | SnapInfra | Raw IaC (Terraform/K8s) |
|--------------|----------------------------|-----------|------------------------|
| Time to first deploy | 1 hour | **1 hour** | 40+ hours |
| Learning curve | Days | **2 weeks** | 3-6 months |
| Transaction support | Missing (Supabase) | **Built-in** | Manual setup |
| Vendor lock-in | High risk | **Full export** | Portable |
| Custom business logic | Limited | **Full code** | Full code |
| Cost predictability | Surprise bills | **Usage caps** | Controlled |
| Production ready | For prototypes | **Day one** | After weeks |
| Monthly cost at 1M users | $0-$2,847 (volatile) | **$0-$299 (capped)** | $280 + 3 engineers |

---

## Why Developers Choose SnapInfra

### Section Title
**Why Developers Choose SnapInfra**

### Feature 1: Real Code, Real Control
Generate TypeScript/Python infrastructure that you own. Every resource, every config - inspect it, version it, customize it.

**Code Example:**
```typescript
// Your generated API route
export const createTask = async (req) => {
  const task = await db.tasks.create({
    userId: req.user.id,
    title: req.body.title
  });
  return task;
}
```

### Feature 2: Exit Strategy Included
Export your entire backend as standard Terraform + Docker Compose. Migrate to AWS, GCP, or your own servers without rewriting a single line.

**Export Example:**
```
$ snapinfra export --format terraform
Exporting...
✓ main.tf
✓ variables.tf
✓ docker-compose.yml
✓ README.md
Done! Deploy anywhere.
```

### Feature 3: No $30K Surprise Bills
Usage caps prevent Firebase nightmares. See exactly what you'll pay at 10x scale before you deploy.

**Pricing:**
- 10K users: $49/mo
- 100K users: $99/mo
- 1M users: $249/mo

**Comparison:** Firebase ~$2,847/mo • Supabase ~$419/mo

### Feature 4: Benefits List
- TypeScript type safety
- Express.js patterns
- PostgreSQL transactions
- Multi-tenant isolation
- RBAC built-in
- Docker-ready
- Terraform export
- Zero lock-in

### Feature 5: Production Ready
- Error handling
- Logging & monitoring
- Security best practices
- Scalable architecture
- Documentation included

---

## How It Works

### Section Title
**From idea to production in 5 minutes**

### Subtitle
Simple enough for solo devs. Powerful enough for unicorns.

### Step 1: Describe What You Want
Just describe your backend in plain English. No JSON schemas. No DSL syntax. No config hell.

**Example Prompt:**
"Build a SaaS backend with user authentication, subscription billing, file uploads to S3, and real-time notifications"

### Step 2: AI Generates Everything
Production-ready code, database schemas, and infrastructure. All generated in minutes.

**Outputs:**
- Backend Code: TypeScript/Express routes
- Database Schema: PostgreSQL tables
- Infrastructure: Terraform/AWS CDK

### Step 3: Deploy Anywhere
One-click deploy to AWS, GCP, or Azure. Or export and run on your own infrastructure.

**Deployment Options:**
- AWS
- Google Cloud
- Azure
- Self-hosted

---

## Built for Real-World Problems

### Section Title
**Built for Real-World Problems**

### Subtitle
The challenges developers face every day

### Problem Statement
After migrating from Firebase (surprise costs) to Supabase (missing transactions) to raw Terraform (6-month learning curve), we asked: **why doesn't the 'just right' solution exist?**

We're not trying to replace Firebase for todo apps or Kubernetes for Netflix. We're for the 99% in between—teams building real products who need production-grade infrastructure without becoming DevOps experts.

### Use Case 1: PostgreSQL Transactions
**Challenge:** Need ACID transactions but Supabase doesn't support them. Building custom infrastructure would take months.

**Outcome:**
- 3 months → 4 hours
- MVP launched same day
- Scales without rewrites

### Use Case 2: Cost Predictability
**Challenge:** Firebase's pay-per-read model becomes unsustainable at scale. Need predictable costs.

**Outcome:**
- Fixed monthly pricing
- Usage caps prevent surprises
- 90% cost reduction vs Firebase

### Use Case 3: Self-Hosted Compliance
**Challenge:** Enterprise requires self-hosted infrastructure for compliance. Terraform learning curve too steep.

**Outcome:**
- Export as Terraform/Docker
- Deploy on-premises
- Zero vendor lock-in

### Trust Metrics
- 100% code ownership
- $0 vendor lock-in
- Production-ready from day one

---

## Built on the Best

### Section Title
**Built on the Best**

### Subtitle
Enterprise tech stack your engineers already love

### Sub-subtitle
No proprietary lock-in. Just battle-tested tools.

### Frontend
- Next.js 15 - React framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS
- React 18 - UI library

### Backend
- Express.js - Web framework
- Node.js 18 - Runtime environment
- AWS CDK - Infrastructure as code
- TypeScript - Type-safe backend

### Infrastructure
- AWS - Cloud platform
- Docker - Containerization
- Terraform - IaC tool
- PostgreSQL - Database

### Why These Tools?
- Industry standard - No vendor lock-in
- Battle-tested at scale - Billions of requests daily
- Your team knows them - Zero learning curve
- Huge ecosystem - Thousands of plugins
- Long-term support - Backed by giants
- 99.99% uptime - Production-ready

---

## Security & Compliance

### Section Title
**Security & Compliance**

### Security Features
- API Security
- Monitoring & Logging
- Incident Response
- Data Protection

### Compliance
- SOC 2 Type II
- ISO 27001
- GDPR Compliant

### Audit Trail
Complete audit logging for all infrastructure changes

---

## FAQ Section

### Section Title
**Addressing Your Concerns**

### Subtitle
Real questions from real developers. Honest answers.

### Q1: The code is probably trash.
**A:** Try the free tier. Check it yourself. We'll wait. The code is production-ready, follows best practices, and includes proper error handling, security measures, and documentation.

### Q2: AI can't understand complex backends.
**A:** You're right to be skeptical. But you're also wrong. Try it with your most complex use case. Snapinfra handles authentication, database schemas, API endpoints, payment processing, and complex business logic.

### Q3: I'll need to rewrite everything anyway.
**A:** Maybe some things. But not everything. And that's still faster than writing it from scratch. You get clean, modular code that's easy to modify and extend.

### Q4: What about security, scaling, and monitoring?
**A:** Built in. We're not sending you a toy. Every generated backend includes security best practices, scalable architecture patterns, error handling, logging, and monitoring setup.

### Q5: This seems too good to be true.
**A:** It kind of is. But it's also real. Hence the free tier. Try it risk-free with one component generation. No credit card required. Export the code and see for yourself.

### Q6: How do I get started?
**A:** Sign up for free. Describe your backend in plain English. Review the generated code. Export and deploy wherever you want. It's your code, your infrastructure, zero lock-in.

---

## Final CTA Section

### Section Title
**From Idea to Production in 5 Minutes**

### Subtitle
Join developers building the future, faster

### CTA Button
**Start Building Free** →

### Trust Text
No credit card required • Full source ownership

### Trust Badges
- SOC 2 Type II
- ISO 27001
- GDPR Compliant

---

## Footer

### Brand
Snapinfra

### Copyright
© 2025 Snapinfra. All rights reserved.

### Links
- GitHub: https://github.com/manojmaheshwarjg/snapinfra

---

## Navigation

### Logo
Snapinfra

### Links
- GitHub (desktop only)

### Buttons
- Sign In
- Sign Up

---

## Open Source Banner

**Open Source** - View on GitHub →

