#!/usr/bin/env node
/**
 * Migration script: Keystatic → Pages CMS
 * 
 * Transforms JSON data from Keystatic's discriminant/value format
 * to Pages CMS's flat type-based format.
 * 
 * Changes:
 * - Page sections: { discriminant: "hero", value: { ... } } → { type: "hero", ... }
 * - Navbar items: { discriminant: "link", value: { ... } } → { type: "link", ... }
 * - Footer columns: { discriminant: "links", value: { ... } } → { type: "links", ... }
 * - Page title: { name: "...", slug: "..." } → "..." (flatten to string)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function transformDiscriminatedUnion(item) {
  if (item && typeof item === 'object' && 'discriminant' in item && 'value' in item) {
    const { discriminant, value } = item;
    // Flatten: merge value fields into top level with type field
    const result = { type: discriminant };
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, value);
    }
    return result;
  }
  return item;
}

function transformArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => transformDiscriminatedUnion(item));
}

function transformPageData(data) {
  const result = { ...data };

  // Flatten title from { name, slug } to just the name string
  if (result.title && typeof result.title === 'object' && result.title.name) {
    result.title = result.title.name;
  }

  // Transform sections
  if (Array.isArray(result.sections)) {
    result.sections = transformArray(result.sections);
  }

  return result;
}

function transformNavbar(data) {
  const result = { ...data };

  if (Array.isArray(result.navItems)) {
    result.navItems = result.navItems.map(item => {
      return transformDiscriminatedUnion(item);
    });
  }

  return result;
}

function transformFooter(data) {
  const result = { ...data };

  if (Array.isArray(result.columns)) {
    result.columns = result.columns.map(item => {
      return transformDiscriminatedUnion(item);
    });
  }

  return result;
}

function processFile(filePath, transformer) {
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const transformed = transformer(data);
  writeFileSync(filePath, JSON.stringify(transformed, null, 2) + '\n');
  console.log(`✅ ${filePath}`);
}

function processDirectory(dirPath, transformer) {
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath, transformer);
    } else if (entry.endsWith('.json')) {
      processFile(fullPath, transformer);
    }
  }
}

console.log('🔄 Migrating Keystatic → Pages CMS format...\n');

// Transform all page JSON files
console.log('📄 Pages:');
processDirectory('src/content/pages', transformPageData);

// Transform navbar
console.log('\n🧭 Navbar:');
processFile('src/content/settings/navbar.json', transformNavbar);

// Transform footer
console.log('\n🦶 Footer:');
processFile('src/content/settings/footer.json', transformFooter);

console.log('\n✨ Migration complete!');
