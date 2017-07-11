'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-particle:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        projectName: 'hello-world',
        description: 'It says hello'
      });
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      'README.md',
      'src/index.js',
      'src/hello-world/index.js',
      'src/hello-world/HelloWorld.jsx'
    ]);
  });

  it('imports the componentName in src/component/index.js import statements', () => {
    assert.fileContent(
      'src/hello-world/index.js',
      /HelloWorld/
    );
  });

  it('imports the componentPath in src/index.js import statements', () => {
    assert.fileContent(
      'src/index.js',
      /hello-world/
    );
  });

  it('exposes the correct package name in package.json', () => {
    assert.fileContent(
      'package.json',
      /"name"\: "@procore\/hello-world"/
    );
  });
});
