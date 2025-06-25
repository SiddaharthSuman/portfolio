// stylelint.config.mjs
import standardScss from 'stylelint-config-standard-scss';
import recessOrder from 'stylelint-config-recess-order';
import prettier from 'stylelint-prettier';
import stylelintUseLogical from 'stylelint-use-logical';
import highPerformanceAnim from 'stylelint-high-performance-animation';
import cssModules from 'stylelint-config-css-modules';

const stylelintConfig = {
  extends: [standardScss, recessOrder, prettier, cssModules],
  plugins: [prettier, stylelintUseLogical, highPerformanceAnim],
  rules: {
    // overrides: [
    //   {
    //     files: ['**/*.module.scss'],
    //     rules: {
    //       'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
    //     },
    //   },
    // ],
    'csstools/use-logical': 'always',
    'prettier/prettier': true,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer'],
      },
    ],
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$', // camelCase
  },
};

export default stylelintConfig;
