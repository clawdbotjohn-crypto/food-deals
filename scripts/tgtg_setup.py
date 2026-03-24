#!/usr/bin/env python3
"""
TGTG (Too Good To Go) Setup Script.

One-time interactive setup that authenticates with the TGTG API
and saves credentials to ~/.tgtg_credentials.json.

Usage:
    python3 tgtg_setup.py

Requires:
    pip install tgtg
"""

import json
import sys
from pathlib import Path

CREDENTIALS_PATH = Path.home() / ".tgtg_credentials.json"


def main():
    print("🥡 TGTG Setup — Too Good To Go Authentication")
    print("=" * 50)
    print()

    if CREDENTIALS_PATH.exists():
        print(f"⚠️  Existing credentials found at {CREDENTIALS_PATH}")
        resp = input("   Overwrite? (y/N): ").strip().lower()
        if resp != "y":
            print("   Keeping existing credentials. Exiting.")
            sys.exit(0)
        print()

    try:
        from tgtg import TgtgClient
    except ImportError:
        print("❌ tgtg library not installed. Run:")
        print("   pip install tgtg")
        sys.exit(1)

    email = input("📧 Enter your TGTG email address: ").strip()
    if not email:
        print("❌ Email is required.")
        sys.exit(1)

    print()
    print(f"📬 Sending login email to {email}...")
    print("   Check your email and click the login link when prompted.")
    print()

    try:
        client = TgtgClient(email=email)
        credentials = client.get_credentials()
    except Exception as e:
        error_msg = str(e)
        if "check your email" in error_msg.lower() or "polling" in error_msg.lower():
            # The library handles polling internally — this shouldn't happen
            # but just in case an older version does it differently
            print("⏳ Waiting for email confirmation...")
            print("   Open the email from Too Good To Go and click the link.")
            try:
                credentials = client.get_credentials()
            except Exception as e2:
                print(f"\n❌ Authentication failed: {e2}")
                sys.exit(1)
        else:
            print(f"\n❌ Authentication failed: {e}")
            print("\nTroubleshooting:")
            print("  - Make sure you have a TGTG account with that email")
            print("  - Check spam folder for the login email")
            print("  - Try again in a few minutes (rate limiting)")
            sys.exit(1)

    if not credentials:
        print("❌ Failed to get credentials.")
        sys.exit(1)

    # Save credentials
    CREDENTIALS_PATH.write_text(json.dumps(credentials, indent=2))
    CREDENTIALS_PATH.chmod(0o600)  # Restrict permissions

    print()
    print(f"✅ Credentials saved to {CREDENTIALS_PATH}")
    print(f"   User ID: {credentials.get('user_id', 'N/A')}")
    print()
    print("You can now run tgtg_sync.py to fetch deals!")


if __name__ == "__main__":
    main()
