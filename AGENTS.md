# Moltbot Repository Guidelines

Multi-channel messaging gateway CLI with AI agent capabilities. Supports WhatsApp (Baileys), Discord, Telegram, Signal, Slack, Line, iMessage, and extensible via plugins.

- **Repo:** https://github.com/moltbot/moltbot
- **Docs:** https://docs.molt.bot/
- **GitHub issues/comments/PR comments:** use literal multiline strings or `-F - <<'EOF'` (or `$'...'`) for real newlines; never embed `\\n`.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Build, Test & Development](#build-test--development)
3. [Coding Style & Conventions](#coding-style--conventions)
4. [Release Channels](#release-channels)
5. [Testing Guidelines](#testing-guidelines)
6. [Commit & PR Guidelines](#commit--pr-guidelines)
7. [Documentation (Mintlify)](#documentation-mintlify)
8. [Security & Configuration](#security--configuration)
9. [Agent-Specific Notes](#agent-specific-notes)
10. [Multi-Agent Safety](#multi-agent-safety)
11. [Platform-Specific Notes](#platform-specific-notes)
12. [VM Operations (exe.dev)](#vm-operations-exedev)
13. [NPM Publishing](#npm-publishing)

---

## Project Structure

### Core Source (`src/`)

| Directory | Purpose |
|-----------|---------|
| `src/cli/` | CLI entry points and wiring (channels, gateway, cron, config, auth) |
| `src/commands/` | Command handlers (agents, auth-choice, etc.) |
| `src/gateway/` | Gateway server (websocket, routing, multi-channel coordination) |
| `src/infra/` | Infrastructure (databases, caching, telemetry) |
| `src/config/` | Configuration management |
| `src/routing/` | Message routing logic |

#### Channel Implementations (Built-in)
| Directory | Channel |
|-----------|---------|
| `src/discord/` | Discord |
| `src/telegram/` | Telegram |
| `src/signal/` | Signal |
| `src/slack/` | Slack |
| `src/web/` | WhatsApp Web (Baileys) |
| `src/whatsapp/` | WhatsApp protocol utilities |
| `src/imessage/` | iMessage |
| `src/line/` | LINE (Japan) |
| `src/channels/` | Shared channel infrastructure (allowlists, pairing, command gating) |

#### Agent & Automation
| Directory | Purpose |
|-----------|---------|
| `src/agents/` | Agent management and provisioning |
| `src/acp/` | Agent Control Protocol (ACP) implementation |
| `src/auto-reply/` | Auto-reply automation |
| `src/cron/` | Cron job scheduling |
| `src/hooks/` | Event hooks system |
| `src/memory/` | Memory/context management |
| `src/pairing/` | Channel pairing logic |

#### Providers & Plugins
| Directory | Purpose |
|-----------|---------|
| `src/providers/` | LLM providers (Claude, Gemini, OpenAI, Ollama, etc.) |
| `src/plugin-sdk/` | Plugin SDK for extensions |
| `src/plugins/` | Plugin registry and management |

#### Media & Content
| Directory | Purpose |
|-----------|---------|
| `src/media/` | Media pipeline (image/video/PDF processing) |
| `src/media-understanding/` | AI-based image/video analysis |
| `src/link-understanding/` | Link parsing and content extraction |
| `src/markdown/` | Markdown rendering |
| `src/tts/` | Text-to-speech |

#### UI & Browser
| Directory | Purpose |
|-----------|---------|
| `src/tui/` | Terminal User Interface |
| `src/browser/` | Browser control and automation |
| `src/canvas-host/` | Canvas rendering host |
| `src/terminal/` | Terminal utilities (tables, palette, colors) |

#### Utilities
| Directory | Purpose |
|-----------|---------|
| `src/logging/` | Logging system |
| `src/sessions/` | Session management |
| `src/security/` | Security utilities |
| `src/shared/` | Shared utilities |
| `src/utils/` | General utilities |
| `src/compat/` | Compatibility layer |
| `src/macos/` | macOS integration |

### Extensions (`extensions/`)

Plugin workspace packages extending core functionality. Each has a `clawdbot.plugin.json` manifest.

**Channel Extensions:**
- `discord/`, `slack/`, `telegram/`, `signal/`, `line/`, `whatsapp/` - Channel implementations
- `imessage/`, `bluebubbles/` - iMessage variants
- `zalo/`, `zalouser/` - Vietnamese messaging
- `matrix/`, `mattermost/`, `msteams/`, `googlechat/`, `nextcloud-talk/` - Enterprise platforms
- `nostr/`, `tlon/`, `twitch/` - Decentralized/streaming platforms
- `voice-call/` - Voice calling

**Provider Extensions:**
- `google-antigravity-auth/`, `google-gemini-cli-auth/`, `qwen-portal-auth/`, `copilot-proxy/`

**Feature Extensions:**
- `memory-core/`, `memory-lancedb/` - Memory/RAG backends
- `llm-task/` - LLM task execution
- `lobster/`, `open-prose/` - Integrations
- `diagnostics-otel/` - OpenTelemetry diagnostics

**Plugin Guidelines:**
- Keep plugin-only deps in the extension `package.json`; do not add to root unless core uses them
- Install runs `npm install --omit=dev` in plugin dir; runtime deps must be in `dependencies`
- Avoid `workspace:*` in `dependencies` (npm install breaks); use `devDependencies` or `peerDependencies` for `moltbot`

### Native Apps (`apps/`)

| Directory | Platform | Tech |
|-----------|----------|------|
| `apps/ios/` | iOS | Swift, XcodeGen |
| `apps/android/` | Android | Kotlin, Gradle |
| `apps/macos/` | macOS | Swift, menubar app + gateway |
| `apps/shared/` | Shared | MoltbotKit (Swift library) |

### Skills (`skills/`)

~52 agent skill definitions for external service integration. Categories include:
- **Messaging:** discord, slack, imsg, bird (Twitter)
- **Productivity:** notion, obsidian, bear-notes, apple-notes, apple-reminders, things-mac, trello
- **Media:** video-frames, camsnap, gifgrep, songsee
- **Development:** github, coding-agent
- **LLMs/APIs:** gemini, openai-image-gen, openai-whisper, nano-pdf
- **Services:** 1password, himalaya (email), food-order
- **Hardware/IoT:** openhue (Philips Hue), sonoscli (Sonos)
- **Tools:** tmux, goplaces, weather, canvas, peekaboo, voice-call

### Documentation (`docs/`)

Mintlify-hosted at https://docs.molt.bot/. Key directories:
- `docs/channels/` - Channel-specific guides
- `docs/cli/` - CLI command reference
- `docs/concepts/` - Conceptual guides (routing, pairing, allowlists)
- `docs/install/` - Installation instructions
- `docs/plugins/` - Plugin development
- `docs/providers/` - LLM provider setup
- `docs/platforms/` - Platform guides (iOS, Android, macOS)
- `docs/gateway/` - Gateway configuration
- `docs/automation/`, `docs/hooks/` - Automation and hooks
- `docs/reference/` - API reference, RELEASING.md

### Other Key Directories

| Directory | Purpose |
|-----------|---------|
| `ui/` | Web UI (React/Lit components), served at `/control` endpoint |
| `Swabble/` | macOS wake-word detection daemon (Swift) |
| `scripts/` | Build, release, and utility scripts |
| `test/` | Test fixtures, helpers, mocks |
| `vendor/` | Vendored assets (a2ui bundle) |
| `assets/` | Branding assets (DMG backgrounds, avatars) |
| `.github/` | CI/CD workflows, issue templates, labeler config |

### Workspace Configuration

**pnpm Workspaces** (in `pnpm-workspace.yaml`):
- Root package (`.`)
- `ui/` - Web UI
- `packages/*` - Monorepo packages
- `extensions/*` - Plugin packages

**When adding channels/extensions/apps/docs:** review `.github/labeler.yml` for label coverage.

---

## Build, Test & Development

### Requirements
- **Node:** 22+ (keep Node + Bun paths working)
- **Package Manager:** pnpm 10.23.0

### Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `prek install` | Install pre-commit hooks (same checks as CI) |
| `pnpm build` | Type-check and build (tsc) |
| `pnpm lint` | Lint (oxlint) |
| `pnpm format` | Format check (oxfmt) |
| `pnpm test` | Run tests (vitest) |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm moltbot ...` | Run CLI in dev mode |
| `pnpm dev` | Run CLI in dev mode |

### Platform-Specific

**iOS:**
```bash
pnpm ios:gen      # Generate Xcode project
pnpm ios:open     # Generate and open in Xcode
pnpm ios:build    # Build for simulator
pnpm ios:run      # Build and run on simulator
```

**Android:**
```bash
pnpm android:assemble  # Build debug APK
pnpm android:install   # Install debug APK
pnpm android:run       # Install and launch
pnpm android:test      # Run unit tests
```

**macOS:**
```bash
pnpm mac:package   # Package app (scripts/package-mac-app.sh)
pnpm mac:restart   # Restart gateway (scripts/restart-mac.sh)
pnpm mac:open      # Open built app
```

### TypeScript Execution
- Prefer **Bun** for scripts/dev/tests: `bun <file.ts>` / `bunx <tool>`
- **Node** supported for built output (`dist/*`) and production installs
- Also supported: `bun install` (keep `pnpm-lock.yaml` in sync)

---

## Coding Style & Conventions

- **Language:** TypeScript (ESM). Prefer strict typing; avoid `any`.
- **Formatting/Linting:** Oxlint and Oxfmt; run `pnpm lint` before commits.
- **Comments:** Add brief comments for tricky or non-obvious logic.
- **File Size:** Aim for ~500-700 LOC max; split/refactor when it improves clarity.
- **Naming:**
  - Use **Moltbot** for product/app/docs headings
  - Use `moltbot` for CLI command, package/binary, paths, and config keys
- **Patterns:** Use existing patterns for CLI options and dependency injection via `createDefaultDeps`.
- **CLI Progress:** Use `src/cli/progress.ts` (`osc-progress` + `@clack/prompts` spinner); don't hand-roll.
- **Tables/Output:** Use `src/terminal/table.ts` for ANSI-safe tables.
- **Colors:** Use shared CLI palette in `src/terminal/palette.ts` (no hardcoded colors).

### Tool Schema Guardrails
- Avoid `Type.Union` in tool input schemas; no `anyOf`/`oneOf`/`allOf`
- Use `stringEnum`/`optionalStringEnum` for string lists
- Use `Type.Optional(...)` instead of `... | null`
- Keep top-level tool schema as `type: "object"` with `properties`
- Avoid raw `format` property names (reserved keyword in some validators)

### Dependencies
- Never update the Carbon dependency
- Patched dependencies (`pnpm.patchedDependencies`) must use exact versions (no `^`/`~`)
- Patching dependencies requires explicit approval

---

## Release Channels

| Channel | Description | npm dist-tag |
|---------|-------------|--------------|
| stable | Tagged releases (`vYYYY.M.D`) | `latest` |
| beta | Prerelease tags (`vYYYY.M.D-beta.N`) | `beta` |
| dev | Moving head on `main` | N/A |

### Version Locations
- `package.json` - CLI version
- `apps/android/app/build.gradle.kts` - versionName/versionCode
- `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist` - CFBundleShortVersionString/CFBundleVersion
- `apps/macos/Sources/Moltbot/Resources/Info.plist` - CFBundleShortVersionString/CFBundleVersion
- `docs/install/updating.md` - Pinned npm version
- `docs/platforms/mac/release.md` - APP_VERSION/APP_BUILD examples

### Release Guardrails
- Do not change version numbers without explicit consent
- Always ask permission before running npm publish/release steps
- Read `docs/reference/RELEASING.md` and `docs/platforms/mac/release.md` before any release work

---

## Testing Guidelines

- **Framework:** Vitest with V8 coverage (70% threshold for lines/branches/functions/statements)
- **Naming:** Match source names with `*.test.ts`; e2e in `*.e2e.test.ts`
- **Pre-push:** Run `pnpm test` (or `pnpm test:coverage`) when touching logic
- **Workers:** Do not set test workers above 16

### Test Commands

| Command | Purpose |
|---------|---------|
| `pnpm test` | Run unit tests |
| `pnpm test:coverage` | Run with coverage |
| `pnpm test:e2e` | Run e2e tests |
| `pnpm test:live` | Live tests (requires `CLAWDBOT_LIVE_TEST=1` or `LIVE=1`) |
| `pnpm test:docker:live-models` | Docker live model tests |
| `pnpm test:docker:live-gateway` | Docker live gateway tests |
| `pnpm test:docker:onboard` | Docker onboarding e2e |
| `pnpm test:docker:all` | All Docker tests |

### Mobile Testing
- Before using simulators, check for connected real devices (iOS + Android) and prefer them
- "Restart iOS/Android apps" means rebuild (recompile/install) and relaunch, not just kill/launch

### Changelog Notes
- Pure test additions/fixes generally do **not** need a changelog entry unless they alter user-facing behavior

---

## Commit & PR Guidelines

### Commits
- Create commits with `scripts/committer "<msg>" <file...>`; avoid manual `git add`/`git commit`
- Follow concise, action-oriented messages (e.g., `CLI: add verbose flag to send`)
- Group related changes; avoid bundling unrelated refactors

### Changelog Workflow
- Keep latest released version at top (no `Unreleased` section)
- After publishing, bump version and start a new top section
- When working on a PR: add entry with PR number and thank the contributor
- When working on an issue: reference the issue in the entry

### PR Review Flow
- When given a PR link: review via `gh pr view`/`gh pr diff`; **do not** switch branches or change code
- Prefer single `gh pr view --json ...` to batch metadata/comments
- Before starting: run `git pull`; if local changes exist, alert user first

### PR Landing Flow
1. Create integration branch from `main`
2. Bring in PR commits (**prefer rebase** for linear history; merge if conflicts)
3. Apply fixes, add changelog (+ thanks + PR #)
4. Run full gate locally: `pnpm lint && pnpm build && pnpm test`
5. Commit, merge back to `main`
6. Delete topic branch, end on `main`
7. If squashing, add PR author as co-contributor
8. Leave PR comment with SHA hashes
9. For new contributors: add avatar to README "clawtributors" section
10. Run `bun scripts/update-clawtributors.ts` if contributor missing

### Shorthand: `sync`
If working tree is dirty, commit all changes (sensible Conventional Commit message), then `git pull --rebase`; if conflicts cannot resolve, stop; otherwise `git push`.

---

## Documentation (Mintlify)

Docs hosted at https://docs.molt.bot/

### Link Conventions
- **Internal links in `docs/**/*.md`:** Root-relative, no `.md`/`.mdx`
  - Example: `[Config](/configuration)`
- **Section cross-references:** Use anchors on root-relative paths
  - Example: `[Hooks](/configuration#hooks)`
- **README (GitHub):** Keep absolute URLs (`https://docs.molt.bot/...`)
- **When Peter asks for links:** Reply with full `https://docs.molt.bot/...` URLs

### Content Guidelines
- Avoid em dashes and apostrophes in headings (breaks Mintlify anchors)
- Use generic content: no personal device names/hostnames/paths
- Use placeholders like `user@gateway-host` and "gateway host"
- When you touch docs, end reply with the `https://docs.molt.bot/...` URLs referenced

---

## Security & Configuration

- **Credentials:** `~/.clawdbot/credentials/`; rerun `moltbot login` if logged out
- **Sessions:** `~/.clawdbot/sessions/` (base directory not configurable)
- **Agent logs:** `~/.clawdbot/agents/<agentId>/sessions/*.jsonl`
- **Environment variables:** See `~/.profile`

### Security Rules
- Never commit or publish real phone numbers, videos, or live config values
- Use obviously fake placeholders in docs, tests, and examples
- Never send streaming/partial replies to external messaging surfaces (WhatsApp, Telegram)

---

## Agent-Specific Notes

### Vocabulary
- "makeup" = "mac app"

### General Rules
- Never edit `node_modules` (global/Homebrew/npm/git installs too)
- When working on GitHub Issue or PR, print full URL at end of task
- Respond with high-confidence answers only; verify in code, do not guess
- Skill notes go in `tools.md` or `AGENTS.md`

### Session Files
When asked to open a "session" file, open Pi session logs under `~/.clawdbot/agents/<agentId>/sessions/*.jsonl` (newest unless specific ID given), not `sessions.json`.

### Signal (Fly.io)
"update fly" command:
```bash
fly ssh console -a flawd-bot -C "bash -lc 'cd /data/clawd/moltbot && git pull --rebase origin main'"
fly machines restart e825232f34d058 -a flawd-bot
```

### SwiftUI State Management
- Prefer `Observation` framework (`@Observable`, `@Bindable`) over `ObservableObject`/`@StateObject`
- Migrate existing usages when touching related code

### Connection Providers
When adding new connections, update every UI surface and docs:
- macOS app, web UI, mobile if applicable
- Onboarding/overview docs
- Add matching status + configuration forms

---

## Multi-Agent Safety

These rules apply when multiple agents may be working concurrently:

- Do **not** create/apply/drop `git stash` entries unless explicitly requested
- Do **not** use `git pull --rebase --autostash`
- Do **not** create/remove/modify `git worktree` checkouts (or `.worktrees/*`)
- Do **not** switch branches unless explicitly requested
- When user says "push": may `git pull --rebase` (never discard other agents' work)
- When user says "commit": scope to your changes only
- When user says "commit all": commit everything in grouped chunks
- When you see unrecognized files: keep going, focus on your changes only
- Focus reports on your edits; avoid guardrail disclaimers unless truly blocked
- End with brief "other files present" note only if relevant

### Lint/Format Churn
- If staged+unstaged diffs are formatting-only, auto-resolve without asking
- If commit/push already requested, auto-stage formatting-only follow-ups
- Only ask when changes are semantic (logic/data/behavior)

---

## Platform-Specific Notes

### macOS

**Gateway:** Runs only as menubar app; no separate LaunchAgent. Restart via:
- Moltbot Mac app
- `scripts/restart-mac.sh`

**Verify/Kill:**
```bash
launchctl print gui/$UID | grep moltbot
```

**Logs:** Use `./scripts/clawlog.sh` (expects passwordless sudo for `/usr/bin/log`)

**Packaging:**
- Dev: `scripts/package-mac-app.sh` (defaults to current arch)
- Release checklist: `docs/platforms/mac/release.md`
- Do not rebuild macOS app over SSH; must run directly on Mac

**Notary Auth Env Vars:**
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_API_KEY_P8`

**Voice Wake Forwarding:**
- Command template: `moltbot-mac agent --message "${text}" --thinking low`
- Ensure app's launch agent PATH includes pnpm bin (typically `$HOME/Library/pnpm`)

### iOS

**Team ID Lookup:**
```bash
security find-identity -p codesigning -v  # Use Apple Development (...) TEAMID
defaults read com.apple.dt.Xcode IDEProvisioningTeamIdentifiers  # Fallback
```

**Device Checks:** Verify connected real devices before using simulators

### A2UI Bundle
- Hash at `src/canvas-host/a2ui/.bundle.hash` is auto-generated
- Regenerate via `pnpm canvas:a2ui:bundle` or `scripts/bundle-a2ui.sh`
- Commit hash as separate commit

---

## VM Operations (exe.dev)

### Access
```bash
ssh exe.dev
ssh vm-name
```
SSH flaky: use exe.dev web terminal or Shelley; keep a tmux session for long ops.

### Update
```bash
sudo npm i -g moltbot@latest  # Global install needs root
```

### Config
```bash
moltbot config set ...
# Ensure gateway.mode=local is set
# Discord: store raw token only (no DISCORD_BOT_TOKEN= prefix)
```

### Restart Gateway
```bash
pkill -9 -f moltbot-gateway || true
nohup moltbot gateway run --bind loopback --port 18789 --force > /tmp/moltbot-gateway.log 2>&1 &
```

### Verify
```bash
moltbot channels status --probe
ss -ltnp | rg 18789
tail -n 120 /tmp/moltbot-gateway.log
```

---

## NPM Publishing

Use 1Password skill; all `op` commands must run in a fresh tmux session.

```bash
# Sign in
eval "$(op signin --account my.1password.com)"

# Get OTP
op read 'op://Private/Npmjs/one-time password?attribute=otp'

# Publish (from package dir)
npm publish --access public --otp="<otp>"

# Verify without local npmrc side effects
npm view <pkg> version --userconfig "$(mktemp)"

# Kill tmux session after publish
```

---

## Troubleshooting

- **Rebrand/migration issues or legacy config/service warnings:** Run `moltbot doctor` (see `docs/gateway/doctor.md`)
- **Bug investigations:** Read source code of relevant npm dependencies and all related local code before concluding; aim for high-confidence root cause
