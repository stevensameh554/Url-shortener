# Data Model: LinkPulse URL Shortener Platform

## User

Represents an account holder who owns links and private analytics.

**Fields**:

- `id`: Stable unique identifier.
- `name`: Display name, required, trimmed, limited length.
- `email`: Unique email address, required, normalized to lowercase.
- `passwordHash`: Secure password hash, never returned to clients.
- `createdAt`: Account creation timestamp.
- `updatedAt`: Last profile or credential metadata update timestamp.

**Relationships**:

- Has many `Link` records.
- Has many `RefreshSession` records.

**Validation Rules**:

- Email must be syntactically valid and unique.
- Password must meet configured length and complexity requirements.
- Name must not be empty after trimming.

## RefreshSession

Represents a revocable renewable login session.

**Fields**:

- `id`: Stable unique identifier.
- `userId`: Owning user.
- `tokenHash`: Hashed refresh token identifier.
- `expiresAt`: Expiration timestamp.
- `revokedAt`: Optional revocation timestamp.
- `createdAt`: Session creation timestamp.

**Relationships**:

- Belongs to one `User`.

**Validation Rules**:

- Token hash must be unique.
- Expired or revoked sessions cannot refresh access.

**State Transitions**:

- `active` -> `expired` when `expiresAt` passes.
- `active` -> `revoked` on logout or suspicious reuse.

## Link

Represents a shortened URL.

**Fields**:

- `id`: Stable unique identifier.
- `userId`: Optional owner; null for anonymous links.
- `originalUrl`: Valid public HTTP or HTTPS destination.
- `shortCode`: Unique generated code used in public short URLs.
- `customAlias`: Optional unique user-selected alias.
- `status`: `active`, `disabled`, or `deleted`.
- `clickCount`: Denormalized successful redirect count.
- `expiresAt`: Optional expiration timestamp.
- `createdAt`: Link creation timestamp.
- `updatedAt`: Last settings update timestamp.
- `deletedAt`: Optional deletion timestamp.

**Relationships**:

- Optionally belongs to one `User`.
- Has many `ClickEvent` records.
- Has derived `QRCode` output.

**Validation Rules**:

- Destination must be a public `http` or `https` URL.
- Short code and alias must be unique.
- Alias must use allowed characters and length.
- Expiration must be in the future when creating an active link.
- Only owners can edit, disable, enable, delete, or view private analytics for owned links.

**State Transitions**:

- `active` -> `disabled` when an owner disables the link.
- `disabled` -> `active` when an owner re-enables the link and expiration still allows it.
- `active` or `disabled` -> `deleted` when an owner deletes the link.
- Any non-deleted link becomes unavailable for redirect once `expiresAt` is in the past.

## ClickEvent

Represents one successful visit to an active short link.

**Fields**:

- `id`: Stable unique identifier.
- `linkId`: Link that was visited.
- `clickedAt`: Timestamp of redirect.
- `visitorHash`: Privacy-preserving visitor identifier for unique visitor estimation.
- `ipHash`: Optional privacy-preserving IP-derived hash.
- `userAgent`: Raw user agent string when available.
- `browser`: Parsed browser family when available.
- `operatingSystem`: Parsed operating system family when available.
- `deviceType`: Parsed device category such as desktop, mobile, tablet, bot, or unknown.
- `referrer`: Referrer URL or domain when available.
- `country`: Best-effort country code or name when available.

**Relationships**:

- Belongs to one `Link`.

**Validation Rules**:

- Click events must reference an existing link.
- Missing metadata must be represented as unknown or null rather than failing analytics.
- Private raw network identifiers must not be exposed through analytics responses.

## QRCode

Derived representation of a LinkPulse short URL.

**Fields**:

- `linkId`: Link used to generate the code.
- `format`: Output format requested by the user, such as PNG or SVG.
- `shortUrl`: Encoded short URL.

**Relationships**:

- Derived from one `Link`.

**Validation Rules**:

- QR code can only be generated for links visible to the requesting user.
- QR output must encode the short URL, not the original destination.

## Indexing and Query Notes

- Users require a unique email index.
- Links require unique indexes on `shortCode` and `customAlias`.
- Links require indexes on `userId`, `status`, `createdAt`, `expiresAt`, and `clickCount` for dashboard filtering and sorting.
- Click events require indexes on `(linkId, clickedAt)`, `(linkId, visitorHash)`, and metadata dimensions used by analytics queries.
- Refresh sessions require indexes on `userId`, `tokenHash`, `expiresAt`, and `revokedAt`.
