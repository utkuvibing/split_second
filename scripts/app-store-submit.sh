#!/usr/bin/env bash
set -euo pipefail

# Split Second App Store Connect submission chain.
#
# Required local tools:
# - Node.js 20+
# - npm dependencies installed
# - EAS CLI available through npx
#
# Required GitHub Actions secret for CI builds:
# - EAS_TOKEN: Expo access token. The workflow maps this to EXPO_TOKEN for EAS CLI.
#
# Required App Store Connect credentials for non-interactive submit:
# - APPLE_API_KEY: Contents of the App Store Connect API .p8 key, or store the key securely in CI and write it to a temporary file.
# - APPLE_API_KEY_ID: App Store Connect API key ID.
# - APPLE_API_ISSUER_ID: App Store Connect issuer ID.
# - Apple Developer Program membership must be active.
# - The iOS app record must exist in App Store Connect before final submission.
#
# EAS submit can also be configured later in eas.json with ascApiKeyPath,
# ascApiKeyId, and ascApiKeyIssuerId once the Apple account is active.

npx eas login
npx eas build --platform ios --profile production --non-interactive
npx eas submit --platform ios --profile production --non-interactive
