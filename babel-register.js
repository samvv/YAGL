require('@babel/register')({
  ignore: ['node_modules/*', '*.test.ts'],
  extensions: [ '.ts', '.js', '.mjs' ]
});
