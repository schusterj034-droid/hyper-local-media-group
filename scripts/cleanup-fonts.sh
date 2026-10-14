#!/bin/bash
# Cleanup unused font files

echo "🧹 Removing unused font files..."

# Remove Medium and SemiBold fonts (no longer referenced)
rm -f public/fonts/Poppins-Medium.woff2
rm -f public/fonts/Poppins-SemiBold.woff2

echo "✅ Removed:"
echo "   - Poppins-Medium.woff2"
echo "   - Poppins-SemiBold.woff2"
echo ""
echo "📦 Remaining fonts:"
ls -lh public/fonts/
echo ""
echo "💾 Space saved: ~100KB"
