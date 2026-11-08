import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentTheme } from './themeController.js';

test('getCurrentTheme defaults safely', () => {
  // In node environment without localStorage
  const theme = getCurrentTheme();
  assert.ok(['dark', 'light'].includes(theme));
});
