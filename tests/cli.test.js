const { createResource } = require('../src/commands/create');
const { validateResourceName } = require('../src/utils/validation');
const { getTemplates } = require('../src/utils/templates');

describe('FXP CLI Tests', () => {
  describe('Validation', () => {
    test('validates resource names correctly', () => {
      expect(validateResourceName('my-resource')).toBe(true);
      expect(validateResourceName('test_resource')).toBe(true);
      expect(validateResourceName('123invalid')).toContain('cannot start');
      expect(validateResourceName('')).toContain('required');
      expect(validateResourceName('a')).toContain('at least 2 characters');
    });
  });

  describe('Templates', () => {
    test('loads templates correctly', () => {
      const templates = getTemplates();
      expect(templates).toBeDefined();
      expect(templates['basic-fivem']).toBeDefined();
      expect(templates['esx-basic']).toBeDefined();
      expect(templates['qb-basic']).toBeDefined();
    });

    test('template structure is valid', () => {
      const templates = getTemplates();
      Object.keys(templates).forEach(key => {
        const template = templates[key];
        expect(template.name).toBeDefined();
        expect(template.description).toBeDefined();
        expect(template.type).toBeDefined();
      });
    });
  });
});
