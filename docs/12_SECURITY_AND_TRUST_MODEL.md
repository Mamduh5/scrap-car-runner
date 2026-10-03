# Security and Trust Model

## Current authority

VS1 is local-only single-player. The user's device controls inventory, Scrap, distance and the client code. Semantic save validation protects coherence and recovery; run tokens protect ordinary duplicate callbacks. Neither provides anti-cheat. Editing localStorage or JavaScript can change progress. Do not encrypt/sign local saves with a secret shipped in the client and claim authoritative protection.

## Client secrecy

Frontend JavaScript, bundled configuration and runtime assets are public. Never include server credentials, private API keys, purchase-verification secrets or backend service secrets in the game client or VITE_* variables. A provider's publishable identifier is acceptable only when its provider contract explicitly treats it as public; restrict its permitted use accordingly. Source maps default off for distribution, but their absence does not make code secret. Avoid logging full player saves or provider credentials in production diagnostics.

## Storage and lifecycle limits

Ordinary valid mutations queue persistence; failures remain visible and retryable. Close-time flush is best effort and cannot guarantee durability after a kill/crash. Active runs are ephemeral: hidden runs pause and process death loses the unfinished session without granting a reward. Recovery backups are local user data, retain one latest raw recovery value, and are not cloud backups. Browser storage clearing/uninstall may lose progress. Schema/recovery details live in the Data Bible and architecture document.

Current internal VS1 requires one active instance. Multiple tabs/processes can overwrite the same save. One-writer/conflict protection is a public-browser release gate. Native storage/lifecycle/source ownership requires actual Android acceptance before packaging release.

## Backend decision

No backend is required now: all current progress and rewards are local, private and single-player. Do not create speculative authentication, API/database projects or empty backend interfaces. The first real requirement for cross-device cloud save/accounts, a trusted shared leaderboard, or purchase/entitlement verification justifies revisiting this decision.

Cloud save requires authentication, ownership checks, conflict resolution, deletion/export and privacy decisions. Shared scores require a documented authority/abuse model; local results alone are not trusted evidence. Purchases require store-supported verification, restore and replay/idempotency handling before authoritative entitlements can be granted. Remote configuration must not become an uncontrolled arbitrary-code channel.

## Rewarded ads and release work

For ordinary local-only rewards, validated provider/local callbacks and per-attempt idempotency may be adequate according to the SDK contract. Shared/authoritative rewards require stronger provider/server verification and replay protection. Do not mistake a client callback for proof of payment or a trusted entitlement.

Before monetization, review the actual SDK/store requirements, consent/privacy disclosures, data collection, reward cancellation/retry/replay behavior and purchase verification. Before public distribution, review dependency advisories, browser hosting headers/CSP compatible with Phaser, third-party assets/licenses and platform permissions. These are concrete release tasks, not infrastructure to add to today's foundation.
