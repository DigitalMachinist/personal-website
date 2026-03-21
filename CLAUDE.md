# CLAUDE.md

## IMPORTANT RULES

- Always write specifications to describe new features when developing new features before planning work
- Always refer to relevant documentation in `docs/` and `docs/specs/` to provide context for writing new specifications
- Always review the specification yourself, report the results, and don't move forward with implementation planning until the specification is approved
- Always plan out the implementation in a plan file before implementing
- Always make use of superpowers (especially brainstorming) when planning features
- Always build implementation plans using a TDD-approach and plan out the critical path for an agent swarm development process
- Always plan to perform several passes of reviews and self-correction at the end of implementation before considering the implmentation complete
- Always review the implementation plan yourself, report the results, and don't move forward with implementation until the plan is approved
- If an implementation step encounters problems due to system configuration that require the user's attention, always stop and ask for their intervention rather than working around the problem
- If there is any risk of context/conversation compacting when performing an operation, always warn the user first rather than executing the instructions without confirmation
- After resolving conflicts, always rerun all tests to confirm there are no regression failures
- When beginning work on a new feature, build it in a branch so a PR can be created from it and merged into main when it is approved

## Commands to Use

When making tool calls to execute commands defined in package.json, prefer using them as written in this section.
ALWAYS prefer use commands in this format unless you have a good reason not to, then you should confirm with me.

- Set correct node version: `nvm use v24.14.0`
- Build client: `npm run build`
- Generate Resume PDF: `npm run resume`
- Host for Local Development: `npm run dev`
- Force Deploy to Cloudflare (production): `npm run deploy`

## Local Hosting for Development

- Hosted at: http://localhost:4321

## Tech Stack

- Astro v5.17.x
- Node v24.14.0
- Playwright v1.58.x
- Wrangler v4.75.x
- Cloudflare Workers
- See package.json and package-lock.json for dependency versions

## Documentation

### Specifications

- Store implementation plans (current and historical) in `docs/specs/`
- Use date-prefixed filenames: `YYYY-MM-DD-short-description.md`

### Implementation Plans

- Store implementation plans (current and historical) in `docs/plans/`
- Use date-prefixed filenames: `YYYY-MM-DD-short-description.md`

### Permanent Documentation

- Store user-targeted and technical documentation in `docs/`
- Use descriptive non-dated file names in kebab-case: `project-architecture.md`

### Notes

- Store documents that guide implementations or aid development but don't fit another category in `docs/notes/`
- This includes things like session reviews, research notes, audit results, and other working documents that aren't permanent documentation, plans, or specs
- Use date-prefixed filenames: `YYYY-MM-DD-short-description.md`