# Technical Documentation: User Invitation System

This document outlines the implementation of the invitation lifecycle management within the application, covering the `UserInviteController` and `UserInviteService`.

---

## 1. Architectural Overview

The system provides a robust way to add users to teams through two distinct flows: **Private Invitations** (sent to specific emails) and **Public Invitations** (shareable links with cryptographic signatures).

### Key Components

- **Controller:** Manages HTTP routing, and permission enforcement.
- **Service:** Contains business logic for token generation, validation, and team association.
- **Event Layer:** Uses `EventEmitter2` for non-blocking email delivery.
- **Security Layer:** Implements `PermissionGuard` for RBAC and cryptographic hashing for public link integrity.

---

## 2. Controller Specification (`UserInviteController`)

The controller is scoped to the `user-invite` resource and requires a valid team context via the `@HeaderTeamAlias()` decorator.

### Endpoint Mapping

| Method | Path                                 | Guard/Policy           | Description                                                    |
| :----- | :----------------------------------- | :--------------------- | :------------------------------------------------------------- |
| `GET`  | `/`                                  | `read:user-invite`     | Fetches all invites associated with the current `tenantId`.    |
| `POST` | `/create-invite`                     | `create:user-invite`   | Initiates a private invitation for a specific email.           |
| `POST` | `/resend-invite/:id`                 | `create:user-invite`   | Invalidates old token and issues an incremented version.       |
| `POST` | `/use-invite/:token`                 | `UserAuthGuard`        | Consumes a private invite for the logged-in user.              |
| `POST` | `/generate-invite-public-url/:token` | `UseInvitePublicGuard` | Validates signature and consumes a public invite.              |
| `GET`  | `/generate-public-invite`            | `create:user-invite`   | Retrieves or creates the team's persistent public invite link. |

---

## 3. Service Logic & Core Workflows

### 3.1 Token Versioning Strategy

To handle "Resend" functionality without creating orphaned database records, the system uses a **versioned token suffix**:

1.  **Creation:** Token is generated as `[random_string]:0`.
2.  **Resend:** The service splits the string, increments the integer, and saves back (e.g., `...:1`).
3.  **Validation:** When a user clicks a link, the system looks up the exact string. Older versions (e.g., `:0`) will fail lookups once the DB is updated to `:1`.

### 3.2 Public Invite Security

Public invites use a signed URL to prevent unauthorized parameter tampering.
**Signature Formula:**
$$Signature = \text{hash256}(SECRET + userId + timestamp + inviteUid)$$

This ensures that the `inviter` ID and the generation `time` cannot be modified by the recipient.

### 3.3 Invitation Acceptance Flow

1.  **Validation:** `getInviteByUid` checks if the token exists, is not used (`usedAt` is null), and has not expired.
2.  **Type Check:** Ensures a Private token isn't used on a Public endpoint and vice versa.
3.  **Update:** Marks the record with a `usedAt` timestamp.
4.  **Integration:** Calls `UserTeamService.addUserToTeam` to create the permanent membership record.

---

## 4. Event-Driven Email Dispatch

The service decouples the API response from the email delivery using an event emitter.

- **Emitter:** `createInvite` and `resendInvite` methods.
- **Listener:** `handleCreateUserInviteEvent` listens for `UserInviteEvents.CREATE_USER_INVITE`.
- **Template:** Uses the `user-invite` template, passing the team name and the generated frontend URL.

---

## 5. Error Handling Reference

| Exception                   | Logic Trigger                                            |
| :-------------------------- | :------------------------------------------------------- |
| `TEAM_NOT_FOUND`            | The `tenantId` in the request header does not exist.     |
| `INVITE_TOKEN_NOT_FOUND`    | Token string doesn't exist or is the wrong `InviteType`. |
| `INVITE_TOKEN_ALREADY_USED` | The `usedAt` field is already populated.                 |
| `INVITE_TOKEN_EXPIRED`      | $Now - UpdatedAt > 24Days                                |
| `INVITE_CANNOT_RESEND`      | Attempted to resend a `PUBLIC` type invite.              |
