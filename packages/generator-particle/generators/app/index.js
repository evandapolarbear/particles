'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const pascalcase = require('pascalcase');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the exquisite ' + chalk.red('generator-particle') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What would you like to name your particle? (convention: lower-case-dashed)',
      default: 'hello-world'
    }, {
      type: 'input',
      name: 'description',
      message: 'Could you provide a brief description of your particle?',
      default: 'A particle that says hello!'
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const {projectName} = this.props;
    const packagePath = './packages/' + this.props.projectName + '/';
    const componentName = pascalcase(this.props.projectName);
    this.destinationRoot(packagePath);

    // Copy and change default dirname and filename
    // dir: Particle => hello-world-
    // file: particle HelloWorld-
    const componentPath = 'src/' + this.props.projectName + '/';
    this.fs.copyTpl(
      this.templatePath('src/particle/Particle.jsx'),
      this.destinationPath(componentPath + componentName + '.jsx'),
      {componentName}
    );

    this.fs.copyTpl(
      this.templatePath('src/particle/index.js'),
      this.destinationPath(componentPath + 'index.js'),
      {componentName}
    );

    // Copy the rest of src
    this.fs.copyTpl(
      this.templatePath('src/*'),
      this.destinationPath('src/'),
      {componentName, projectName}
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        projectName: this.props.projectName,
        description: this.props.description
      }
    );

    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {
        componentName,
        description: this.props.description
      }
    );
  }

  install() {
    // This.installDependencies();

    this.log(yosay(
      [chalk.red('Next steps:'),
        'from the root directory.',
        chalk.green('yarn bootstrap'),
        chalk.green('cd ./packages/' + this.props.projectName),
        chalk.green('yarn start')
      ].join('\n')
      , {maxLength: 50}
    ));
  }
};
