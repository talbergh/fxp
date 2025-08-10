function validateResourceName(name) {
  if (!name || typeof name !== 'string') {
    return 'Resource name is required';
  }

  if (name.length < 2) {
    return 'Resource name must be at least 2 characters long';
  }

  if (name.length > 50) {
    return 'Resource name must be less than 50 characters long';
  }

  // Valid characters: letters, numbers, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return 'Resource name can only contain letters, numbers, hyphens, and underscores';
  }

  // Cannot start with number or hyphen
  if (/^[0-9-]/.test(name)) {
    return 'Resource name cannot start with a number or hyphen';
  }

  // Reserved names
  const reserved = ['con', 'aux', 'nul', 'prn', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'];
  if (reserved.includes(name.toLowerCase())) {
    return 'Resource name cannot be a reserved system name';
  }

  return true;
}

function validateFramework(framework) {
  const validFrameworks = ['esx', 'qb-core', 'qbox', 'standalone', 'redm'];
  
  if (!framework) {
    return true; // Optional
  }

  if (!validFrameworks.includes(framework.toLowerCase())) {
    return `Invalid framework. Must be one of: ${validFrameworks.join(', ')}`;
  }

  return true;
}

function validateTemplate(template) {
  if (!template || typeof template !== 'string') {
    return 'Template is required';
  }

  // Template validation will be done against available templates
  return true;
}

module.exports = {
  validateResourceName,
  validateFramework,
  validateTemplate
};
